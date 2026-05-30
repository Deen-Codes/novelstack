// CoverEditor — iOS-first (Android/iPad inherit via Expo).
//
// Drops into the Cover tab of /write/[storyId]. Sits on top of the existing
// Cover preview and adds two things:
//
//   1. Tap the title text on the cover → the title becomes editable inline,
//      keyboard opens, typing updates the title both in the preview AND in
//      the story.title field used by the Details tab (one source of truth).
//
//   2. Above the keyboard while editing, a horizontal swipeable strip of
//      font samples (Snapchat-style). Tap or swipe to pick — the title's
//      typeface updates live. Genre picks the default font.
//
// On save, react-native-view-shot captures the composite (background image
// + title overlay in the chosen font + position) to a temporary PNG that
// gets uploaded to R2 the same way a manually-designed cover would.
//
// Fonts are pulled from the family already loaded in _layout.tsx — no extra
// font imports here. Add more by extending FONT_PALETTE below.

import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/theme/tokens';
import { DefaultCover } from './DefaultCover';

// ---- Font palette ---------------------------------------------------------
//
// Each entry is a font that's already loaded in _layout.tsx. `family` is the
// React Native font-family name; `label` is the short tag shown in the picker
// strip; `weight` is a visual hint only.
//
// Add a font here AFTER you've added it to _layout.tsx's useFonts call.
export type FontKey =
  | 'bricolage'
  | 'interTight'
  | 'fraunces'
  | 'manrope'
  | 'sora'
  | 'outfit'
  | 'spaceGrotesk'
  | 'dmSans'
  | 'plusJakarta'
  | 'ibmPlexMono';

const FONT_PALETTE: { key: FontKey; family: string; label: string; tone: 'sans' | 'serif' | 'mono' }[] = [
  { key: 'bricolage',    family: 'BricolageGrotesque_800ExtraBold', label: 'Bricolage', tone: 'sans' },
  { key: 'interTight',   family: 'InterTight_900Black',             label: 'Inter',     tone: 'sans' },
  { key: 'fraunces',     family: 'Fraunces_700Bold',                label: 'Fraunces',  tone: 'serif' },
  { key: 'manrope',      family: 'Manrope_800ExtraBold',            label: 'Manrope',   tone: 'sans' },
  { key: 'sora',         family: 'Sora_700Bold',                    label: 'Sora',      tone: 'sans' },
  { key: 'outfit',       family: 'Outfit_800ExtraBold',             label: 'Outfit',    tone: 'sans' },
  { key: 'spaceGrotesk', family: 'SpaceGrotesk_700Bold',            label: 'Space',     tone: 'sans' },
  { key: 'dmSans',       family: 'DMSans_700Bold',                  label: 'DM Sans',   tone: 'sans' },
  { key: 'plusJakarta',  family: 'PlusJakartaSans_800ExtraBold',    label: 'Jakarta',   tone: 'sans' },
  { key: 'ibmPlexMono',  family: 'IBMPlexMono_700Bold',             label: 'Plex Mono', tone: 'mono' },
];

// ---- Genre → font default ------------------------------------------------
//
// Picks a starting font for each genre that "fits" the register. Author can
// swipe to change at any time — this is just the opening default.
function fontForGenre(genre: string | null | undefined): FontKey {
  const g = (genre ?? '').toLowerCase();
  if (g.includes('thriller') || g.includes('crime') || g.includes('mystery') || g.includes('horror')) return 'ibmPlexMono';
  if (g.includes('romance') || g.includes('contemporary') || g.includes('lgbtq')) return 'plusJakarta';
  if (g.includes('fantasy') || g.includes('paranormal') || g.includes('werewolf') || g.includes('vampire')) return 'fraunces';
  if (g.includes('scifi') || g.includes('sci-fi') || g.includes('dystop')) return 'spaceGrotesk';
  if (g.includes('young_adult') || g.includes('teen')) return 'outfit';
  if (g.includes('historical') || g.includes('drama') || g.includes('poetry')) return 'fraunces';
  if (g.includes('humor') || g.includes('fanfiction')) return 'bricolage';
  return 'bricolage';
}

// ---- Position presets ----------------------------------------------------
type Position = 'bottom-left' | 'bottom-center' | 'top-left' | 'centered';

export type CoverEditorHandle = {
  // Capture the current composite as a PNG and return its file:// URI. Parent
  // then uploads it via the existing /api/me/cover endpoint.
  captureToFile: () => Promise<string>;
  // Read the current title (so the parent can sync it to story.title).
  getTitle: () => string;
};

export const CoverEditor = forwardRef<CoverEditorHandle, {
  // Story id — used to derive the same DefaultCover variant the library
  // shows. Keeps the visual consistent across surfaces.
  storyId?: string;
  // Source image to overlay on. If null/undefined the editor renders the
  // DefaultCover variant for this story (same one the catalog shows).
  imageUri?: string | null;
  // The current title (single source of truth — flows from parent). When the
  // author types in the editor, onTitleChange fires and parent re-pushes.
  title: string;
  onTitleChange: (next: string) => void;
  // Genre is read once to pick the initial font default. Author can change.
  genre?: string | null;
  // Author display name — used by some DefaultCover variants for byline.
  authorName?: string | null;
  // Tapping the cover background (anywhere outside the title) calls this so
  // the parent can launch the image picker. Replaces the dedicated Upload
  // background image button — the cover itself is the affordance.
  onTapBackground?: () => void;
  // Sizing of the cover preview. Parent decides — typically 280x373.
  style?: StyleProp<ViewStyle>;
}>(({ storyId, imageUri, title, onTitleChange, genre, authorName, onTapBackground, style }, ref) => {
  const { width: winW } = useWindowDimensions();

  const [fontKey, setFontKey] = useState<FontKey>(() => fontForGenre(genre));
  // Default to centred per the new title-position rule — spotlight crops the
  // bottom of covers so bottom-left titles get clipped. Centred reads cleanly
  // at thumbnail and hero size both.
  const [position, setPosition] = useState<Position>('centered');
  // Title alignment within its overlay box — independent of `position`. The
  // focus-mode toolbar exposes left / centre / right chips that flip this.
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [editing, setEditing] = useState(false);

  const shotRef = useRef<ViewShot | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  useImperativeHandle(ref, () => ({
    captureToFile: async () => {
      if (!shotRef.current) throw new Error('Cover not ready');
      const uri = await captureRef(shotRef.current as unknown as React.Component, {
        format: 'png',
        quality: 0.95,
        result: 'tmpfile',
      });
      return uri;
    },
    getTitle: () => title,
  }));

  const activeFont = FONT_PALETTE.find((f) => f.key === fontKey) ?? FONT_PALETTE[0];

  // Title rendering style — bottom-left default. Adjusts for position preset.
  const titleStyle = useMemo(() => {
    const base = {
      fontFamily: activeFont.family,
      color: '#F4ECDF',
      fontSize: 34,
      lineHeight: 36,
      letterSpacing: -0.8,
    } as const;
    return base;
  }, [activeFont.family]);

  const overlayPositionStyle: ViewStyle = useMemo(() => {
    switch (position) {
      case 'bottom-center':
        return { position: 'absolute', bottom: 24, left: 16, right: 16, alignItems: 'center' };
      case 'top-left':
        return { position: 'absolute', top: 24, left: 20, right: 20 };
      case 'centered':
        return { position: 'absolute', top: 0, bottom: 0, left: 16, right: 16, justifyContent: 'center', alignItems: 'center' };
      case 'bottom-left':
      default:
        return { position: 'absolute', bottom: 24, left: 20, right: 20 };
    }
  }, [position]);

  // The cover canvas — extracted into a helper so we can render it in two
  // places (inline view, and inside the focus-mode Modal) without code
  // duplication. ViewShot ref is attached only at the currently-mounted
  // location (RN re-attaches refs on remount) and we only capture when
  // editing has ended, so the ref is always pointing at the inline ViewShot
  // when capture happens.
  const renderCanvas = (mode: 'inline' | 'focus') => (
    <ViewShot
      ref={mode === 'inline' ? (shotRef as never) : undefined}
      style={[
        styles.canvas,
        mode === 'focus' && { borderRadius: 18, shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 24, shadowOffset: { width: 0, height: 14 } },
      ]}
      options={{ format: 'png', quality: 0.95 }}
    >
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={() => {
          // Tap on the cover background = "pick a new image" when not editing.
          // When editing, a background tap dismisses the keyboard.
          if (editing) { Keyboard.dismiss(); setEditing(false); return; }
          onTapBackground?.();
        }}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        ) : (
          <View style={StyleSheet.absoluteFillObject}>
            <DefaultCover
              storyId={storyId ?? title}
              title=""        // empty — the editor renders its OWN title overlay on top
              genre={genre}
              authorName={authorName}
              width={winW * 0.85}
            />
          </View>
        )}
      </Pressable>

      <View pointerEvents="none" style={styles.scrim} />

      <View style={overlayPositionStyle}>
        {editing && mode === 'focus' ? (
          <TextInput
            ref={inputRef}
            value={title}
            onChangeText={onTitleChange}
            onBlur={() => setEditing(false)}
            autoFocus
            multiline
            numberOfLines={3}
            placeholder="Tap to add title"
            placeholderTextColor="rgba(244,236,223,0.45)"
            style={[
              titleStyle,
              {
                textAlign: alignment,
                padding: 0,
              },
            ]}
            selectionColor={colors.signal}
          />
        ) : (
          <Pressable onPress={() => setEditing(true)}>
            <Text
              style={[
                titleStyle,
                { textAlign: alignment },
              ]}
              numberOfLines={3}
            >
              {title || 'Tap to add title'}
            </Text>
          </Pressable>
        )}
      </View>
    </ViewShot>
  );

  // Alignment chips — three icons (left / centre / right) docked above the
  // font strip in focus mode. Updates the textAlign of the title without
  // changing the position anchor. MaterialIcons has proper format-align
  // icons that read as actual alignment glyphs at chip size.
  const alignmentRow = (
    <View style={styles.alignRow}>
      {(['left', 'center', 'right'] as const).map((a) => {
        const isActive = a === alignment;
        const iconName: React.ComponentProps<typeof MaterialIcons>['name'] =
          a === 'left' ? 'format-align-left' : a === 'center' ? 'format-align-center' : 'format-align-right';
        return (
          <Pressable
            key={a}
            onPress={() => setAlignment(a)}
            style={[styles.alignChip, isActive && styles.alignChipActive]}
            hitSlop={6}
            accessibilityLabel={`Align ${a}`}
          >
            <MaterialIcons
              name={iconName}
              size={20}
              color={isActive ? colors.creamInk : '#F4ECDF'}
            />
          </Pressable>
        );
      })}
    </View>
  );

  // Font picker strip — shown above the keyboard in focus mode.
  const fontStrip = (
    <View style={styles.fontStripWrap}>
      <FlatList
        horizontal
        keyboardShouldPersistTaps="always"
        data={FONT_PALETTE}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const isActive = item.key === fontKey;
          return (
            <Pressable
              onPress={() => setFontKey(item.key)}
              style={[styles.fontChip, isActive && styles.fontChipActive]}
            >
              <Text style={{ fontFamily: item.family, fontSize: 18, color: isActive ? colors.creamInk : colors.ink }}>
                Aa
              </Text>
              <Text style={[styles.fontChipLabel, isActive && { color: colors.creamInk }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );

  return (
    <View style={style}>
      {/* Inline cover. Stays mounted for layout + view-shot capture even
          when the focus-mode Modal is up — the Modal renders a separate
          interactive copy of the canvas on top of a dimming backdrop. */}
      {renderCanvas('inline')}

      {/* Focus mode. When the author taps the title, the cover "isolates"
          above a dimming backdrop with a font strip docked above the
          keyboard. Tap-away or onBlur dismisses focus. */}
      <Modal
        visible={editing}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setEditing(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.focusBackdrop}
        >
          {/* Tap-away dismisses editing (sibling to the cover, behind it). */}
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => { Keyboard.dismiss(); setEditing(false); }}
          />
          <View style={styles.focusCoverWrap} pointerEvents="box-none">
            <View style={{ width: winW * 0.84, aspectRatio: 3 / 4 }}>
              {renderCanvas('focus')}
            </View>
          </View>
          {alignmentRow}
          {fontStrip}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
});
CoverEditor.displayName = 'CoverEditor';

const styles = StyleSheet.create({
  canvas: {
    aspectRatio: 3 / 4,
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#1A1714',
  },
  scrim: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: '55%',
    backgroundColor: 'transparent',
    // Use a soft gradient via shadow trick — production should swap in
    // expo-linear-gradient for a real bottom-up gradient.
    shadowColor: '#000', shadowOffset: { width: 0, height: -40 }, shadowOpacity: 0.45, shadowRadius: 40,
  },
  // Backdrop for focus mode — dims everything else on screen behind the
  // floating cover + font strip while the title is being edited.
  focusBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'flex-end',
  },
  focusCoverWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  // Alignment toolbar in focus mode — three chips, centered, sits between
  // the floating cover and the font picker.
  alignRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(20,17,15,0.85)',
    borderRadius: 999,
    padding: 4,
    gap: 4,
    marginBottom: 8,
  },
  alignChip: {
    width: 40,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignChipActive: {
    backgroundColor: colors.cream,
  },
  fontStripWrap: {
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: colors.paperSoft,
    borderRadius: 12,
  },
  fontChip: {
    minWidth: 76,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontChipActive: {
    backgroundColor: colors.cream,
  },
  fontChipLabel: {
    marginTop: 2,
    fontSize: 10,
    color: colors.inkMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});
