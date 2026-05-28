/* eslint-disable @typescript-eslint/no-var-requires */
// Local Expo config plugin — patches the generated ios/Podfile to silence a
// huge pile of cosmetic warnings from third-party Pods (Expo SDK 52,
// React Native 0.76, SDWebImage, RNGoogleMobileAds, RNCAsyncStorage, etc).
//
// CocoaPods only permits one top-level `post_install` block per Podfile, so
// we splice our hook code INSIDE Expo's existing post_install block rather
// than appending a second one (which errors out with "Specifying multiple
// `post_install` hooks is unsupported").
//
// Four classes of warning get killed:
//
//   1. "Pointer is missing a nullability type specifier" + every other
//      cosmetic Pod warning — silenced via per-Pod GCC_WARN_INHIBIT_ALL_WARNINGS.
//      Our own app target is untouched, so warnings in our code still surface.
//
//   2. "[CP-User] Run script build phase will be run during every build
//      because it does not specify any outputs" — those scripts are
//      *supposed* to run every build, so we explicitly mark them
//      always-out-of-date.
//
//   3. "Ignoring duplicate libraries: '-lc++'" — OTHER_LDFLAGS deduped.
//
//   4. "iOS deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 9.0,
//      but the range of supported deployment target versions is 12.0 to 26.x"
//      — every Pod below 15.1 bumped to match our project minimum.
//
// The plugin is idempotent — it removes any previously injected block
// before re-injecting the current version, so re-running prebuild is safe.
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER_BEGIN = '# >>> with-silent-pod-warnings begin >>>';
const MARKER_END = '# <<< with-silent-pod-warnings end <<<';

// Body to inject *inside* the existing post_install do |installer| ... end
// block — uses the same `installer` variable Expo's hook receives.
const HOOK_BODY = `
    ${MARKER_BEGIN}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        current = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || current.to_f < 15.1
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        end
        config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
        config.build_settings['CLANG_WARN_DOCUMENTATION_COMMENTS'] = 'NO'
        config.build_settings['CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF'] = 'NO'
        config.build_settings['CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS'] = 'NO'
        config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
        if config.build_settings['OTHER_LDFLAGS'].is_a?(Array)
          config.build_settings['OTHER_LDFLAGS'] = config.build_settings['OTHER_LDFLAGS'].uniq
        end
      end
      target.build_phases.each do |phase|
        if phase.respond_to?(:name) && phase.name && phase.name.include?('[CP-User]')
          phase.always_out_of_date = '1'
        end
      end
    end
    ${MARKER_END}
`;

module.exports = function withSilentPodWarnings(config) {
  return withDangerousMod(config, [
    'ios',
    async (cfg) => {
      const podfilePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'Podfile',
      );
      if (!fs.existsSync(podfilePath)) return cfg;
      let src = fs.readFileSync(podfilePath, 'utf8');

      // Drop any prior version of our block — keeps the plugin idempotent so
      // re-running prebuild never accumulates stale code.
      const blockRe = new RegExp(
        `\\s*${MARKER_BEGIN}[\\s\\S]*?${MARKER_END}\\s*`,
        'g',
      );
      src = src.replace(blockRe, '\n');

      // Find the closing `end` of Expo's existing post_install block (the
      // second-to-last `end` in the Podfile — the very last one closes the
      // outer `target 'NovelStack' do`). Inject our hook body just before
      // that `end` so our settings run *after* react_native_post_install,
      // which means we always win on any setting it touches.
      //
      // Trimmed-right view of the relevant block at end of file:
      //   ...closing nested .each ends...
      //     end
      //     end
      //   end       ← post_install close (2-space indent)
      // end         ← target close (no indent), end-of-file
      //
      // The regex anchors on those last two lines. Without the /m flag,
      // `$` matches only end-of-string, so we always splice at the very
      // bottom and never in the middle of a similar-looking block.
      const closingRe = /(\n[ \t]*end[ \t]*)(\nend[ \t]*\n?)$/;
      if (!closingRe.test(src)) {
        console.warn(
          '[with-silent-pod-warnings] Could not locate the post_install closing — skipping injection.',
        );
        return cfg;
      }
      src = src.replace(closingRe, `\n${HOOK_BODY}$1$2`);

      fs.writeFileSync(podfilePath, src);
      return cfg;
    },
  ]);
};
