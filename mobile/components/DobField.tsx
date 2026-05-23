import { useState } from 'react';
import { Platform, Pressable, Text, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, radius, spacing } from '@/theme/tokens';

// A tappable date-of-birth field backed by the native date picker.
// `value` is an ISO date string (YYYY-MM-DD) or null; `onChange` gets the
// same ISO string. Built from local date parts so the picked day never
// shifts across a timezone boundary.

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pretty(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function DobField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (iso: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : new Date(2000, 0, 1);

  return (
    <View>
      <Pressable style={styles.field} onPress={() => setOpen((o) => !o)}>
        <Text style={value ? styles.value : styles.placeholder}>
          {value ? pretty(value) : 'Select your date of birth'}
        </Text>
        <Text style={styles.caret}>{open ? '▴' : '▾'}</Text>
      </Pressable>

      {open && (
        <View style={styles.pickerWrap}>
          <DateTimePicker
            value={selected}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={(_e, picked) => {
              if (Platform.OS !== 'ios') setOpen(false);
              if (picked) onChange(toISO(picked));
            }}
          />
          {Platform.OS === 'ios' && (
            <Pressable style={styles.done} onPress={() => setOpen(false)}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  value: { fontSize: 15, color: colors.ink },
  placeholder: { fontSize: 15, color: colors.inkFaint },
  caret: { fontSize: 12, color: colors.inkFaint },
  pickerWrap: { marginTop: spacing.sm },
  done: { alignSelf: 'flex-end', paddingVertical: 6, paddingHorizontal: 4 },
  doneText: { fontSize: 14, color: colors.signal, fontWeight: '500' },
});
