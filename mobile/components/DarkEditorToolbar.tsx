import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBridgeState, type EditorBridge } from '@10play/tentap-editor';
import { colors, radius } from '@/theme/tokens';

// A minimal dark formatting toolbar for the chapter editor — replaces 10tap's
// default Toolbar (which renders white and forces the lib's icon set). Six
// buttons, no headings sub-menus, no underline/strikethrough/lists clutter:
// bold, italic, heading, bullet list, undo, redo. Sits flush above the
// keyboard, themed to match the rest of the app.
export function DarkEditorToolbar({ editor }: { editor: EditorBridge }) {
  const state = useBridgeState(editor);

  return (
    <View style={styles.bar}>
      <ToolButton
        label="B"
        bold
        active={state.isBoldActive}
        onPress={() => editor.toggleBold()}
      />
      <ToolButton
        label="I"
        italic
        active={state.isItalicActive}
        onPress={() => editor.toggleItalic()}
      />
      <ToolButton
        label="H"
        bold
        active={!!state.activeHeading}
        onPress={() => editor.toggleHeading(2)}
      />
      <ToolButton
        icon="list"
        active={state.isBulletListActive}
        onPress={() => editor.toggleBulletList()}
      />
      <View style={styles.spacer} />
      <ToolButton
        icon="arrow-undo"
        disabled={!state.canUndo}
        onPress={() => editor.undo()}
      />
      <ToolButton
        icon="arrow-redo"
        disabled={!state.canRedo}
        onPress={() => editor.redo()}
      />
    </View>
  );
}

function ToolButton({
  label,
  icon,
  active,
  disabled,
  bold,
  italic,
  onPress,
}: {
  label?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  active?: boolean;
  disabled?: boolean;
  bold?: boolean;
  italic?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.btn,
        active && styles.btnActive,
        disabled && { opacity: 0.35 },
      ]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={active ? '#FFFFFF' : colors.inkMuted}
        />
      ) : (
        <Text
          style={[
            styles.btnLabel,
            bold && { fontWeight: '800' },
            italic && { fontStyle: 'italic' },
            active && { color: '#FFFFFF' },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.paperSoft,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  spacer: { flex: 1 },
  btn: {
    width: 38,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  btnActive: { backgroundColor: colors.signal },
  btnLabel: { fontSize: 16, color: colors.inkMuted },
});
