/* eslint-disable @typescript-eslint/no-var-requires */
// Local Expo config plugin — patches the generated ios/Podfile to:
//
//   1. Silence the noisy "pointer is missing a nullability type specifier"
//      / deprecated-API / category-override / etc. warnings coming from
//      third-party Pods (Expo SDK 52, React Native 0.76, SDWebImage,
//      RNGoogleMobileAds, RNCAsyncStorage, etc). These are cosmetic — Pod
//      authors will fix them upstream eventually, and they'll be gone for
//      good when we move to a newer Expo SDK.
//
//   2. Silence the "[CP-User] Run script build phase will be run during
//      every build because it does not specify any outputs" warnings for
//      every Pod with a CP-User script phase (RNGoogleMobileAds, Hermes,
//      [RN]Check rncore, expo-updates resources). They're MEANT to always
//      run, so we explicitly mark them always-out-of-date.
//
//   3. Dedupe `-lc++` in OTHER_LDFLAGS so the "Ignoring duplicate
//      libraries" warning goes away.
//
//   4. Bump every Pod whose IPHONEOS_DEPLOYMENT_TARGET is still 9.0 up to
//      our project's 15.1, killing the "iOS deployment target is set to
//      9.0, but the range of supported deployment target versions is 12.0
//      to 26.2.99" warnings (RNCAsyncStorage, SDWebImage).
//
// The plugin runs every time `expo prebuild` regenerates ios/, so these
// fixes survive across rebuilds — no manual Podfile maintenance needed.
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// The post_install hook body we inject before the closing `end` of the
// `target 'NovelStack' do` block. Wrapped in BEGIN/END markers so we never
// double-inject if the plugin runs twice or the Podfile is already patched.
const MARKER_BEGIN = '# >>> with-silent-pod-warnings begin >>>';
const MARKER_END = '# <<< with-silent-pod-warnings end <<<';

const HOOK_SNIPPET = `
  ${MARKER_BEGIN}
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      # Bump every Pod stuck on iOS 9 to match our project minimum so
      # Xcode stops warning "deployment target is set to 9.0, but the
      # range of supported deployment target versions is 12.0 to 26.x".
      target.build_configurations.each do |config|
        current = config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || current.to_f < 15.1
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
        end
        # Silence cosmetic Pod warnings (nullability, deprecated API
        # markers, category-override, etc). Pod-only — our app target is
        # untouched, so warnings in our own code still surface.
        config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
        config.build_settings['CLANG_WARN_DOCUMENTATION_COMMENTS'] = 'NO'
        config.build_settings['CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF'] = 'NO'
        config.build_settings['CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS'] = 'NO'
        config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
        # Kill the duplicate '-lc++' linker warning.
        if config.build_settings['OTHER_LDFLAGS'].is_a?(Array)
          config.build_settings['OTHER_LDFLAGS'] = config.build_settings['OTHER_LDFLAGS'].uniq
        end
      end

      # Mark every [CP-User] script phase always-out-of-date so Xcode
      # stops warning that they have no declared outputs. These scripts
      # are *supposed* to run every build (they write build-time
      # config, replace Hermes, generate updates resources, etc).
      target.build_phases.each do |phase|
        if phase.respond_to?(:name) && phase.name && phase.name.include?('[CP-User]')
          phase.always_out_of_date = '1'
        end
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

      // Idempotent — drop any previous block we injected, then re-inject
      // the current version. Means re-running this plugin is always safe,
      // and updates to HOOK_SNIPPET propagate without leaving stale code.
      const blockRe = new RegExp(
        `\\s*${MARKER_BEGIN}[\\s\\S]*?${MARKER_END}\\s*`,
        'g',
      );
      src = src.replace(blockRe, '\n');

      // Inject the hook just before the closing `end` of `target 'NovelStack' do`.
      // Anchor on the literal target line so we never accidentally patch the
      // global `post_install` or a different target block.
      const targetRe = /(target\s+'[^']+'\s+do[\s\S]*?)\n\s*end\s*$/m;
      const m = src.match(targetRe);
      if (!m) {
        console.warn(
          '[with-silent-pod-warnings] Could not locate target block in Podfile — skipping injection.',
        );
        return cfg;
      }
      const insertAt = m.index + m[1].length;
      src = src.slice(0, insertAt) + '\n' + HOOK_SNIPPET + src.slice(insertAt);

      fs.writeFileSync(podfilePath, src);
      return cfg;
    },
  ]);
};
