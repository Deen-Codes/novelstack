import { useEffect, useState } from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme/tokens';

// Mail apps we can hand the reader off to after sending a magic link. The
// `domains` list lets us guess the reader's provider from the part after the
// @, so the right app is offered first. Schemes must also be declared in
// app.json → ios.infoPlist.LSApplicationQueriesSchemes for canOpenURL to work.
type MailApp = { key: string; name: string; scheme: string; domains: string[] };

const MAIL_APPS: MailApp[] = [
  { key: 'apple', name: 'Mail', scheme: 'message://', domains: ['icloud.com', 'me.com', 'mac.com'] },
  { key: 'gmail', name: 'Gmail', scheme: 'googlegmail://', domains: ['gmail.com', 'googlemail.com'] },
  {
    key: 'outlook',
    name: 'Outlook',
    scheme: 'ms-outlook://',
    domains: [
      'outlook.com', 'outlook.co.uk', 'hotmail.com', 'hotmail.co.uk', 'hotmail.fr',
      'live.com', 'live.co.uk', 'msn.com',
    ],
  },
  {
    key: 'yahoo',
    name: 'Yahoo Mail',
    scheme: 'ymail://',
    domains: ['yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'ymail.com', 'rocketmail.com', 'aol.com'],
  },
  { key: 'proton', name: 'Proton Mail', scheme: 'protonmail://', domains: ['proton.me', 'protonmail.com', 'pm.me'] },
  { key: 'fastmail', name: 'Fastmail', scheme: 'fastmail://', domains: ['fastmail.com', 'fastmail.fm'] },
  { key: 'spark', name: 'Spark', scheme: 'readdle-spark://', domains: [] },
  { key: 'airmail', name: 'Airmail', scheme: 'airmail://', domains: [] },
];

function suggestedAppKey(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return null;
  return MAIL_APPS.find((a) => a.domains.includes(domain))?.key ?? null;
}

// One-tap shortcuts into the reader's mail app, with their likely provider
// (guessed from the email domain) offered first.
export function MailAppLinks({ email }: { email: string }) {
  const [apps, setApps] = useState<MailApp[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found: MailApp[] = [];
      for (const app of MAIL_APPS) {
        try {
          if (await Linking.canOpenURL(app.scheme)) found.push(app);
        } catch {
          // Scheme not detectable — skip.
        }
      }
      // Apple Mail is a system app; offer it even if the probe came back false.
      if (!found.some((a) => a.key === 'apple')) found.unshift(MAIL_APPS[0]);

      const suggested = suggestedAppKey(email);
      if (suggested) {
        const i = found.findIndex((a) => a.key === suggested);
        if (i > 0) found.unshift(found.splice(i, 1)[0]);
      }
      if (!cancelled) setApps(found);
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  async function open(app: MailApp) {
    try {
      await Linking.openURL(app.scheme);
    } catch {
      // App not installed / can't open — nothing to do.
    }
  }

  if (apps.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {apps.map((app, i) => (
        <Pressable
          key={app.key}
          style={i === 0 ? styles.btn : styles.btnOutline}
          onPress={() => open(app)}
        >
          <Text style={i === 0 ? styles.btnText : styles.btnOutlineText}>
            Open {app.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginTop: 14 },
  btn: {
    height: 48,
    borderRadius: 13,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#15100E', fontSize: 14, fontWeight: '700' },
  btnOutline: {
    height: 48,
    borderRadius: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: { color: colors.ink, fontSize: 14, fontWeight: '600' },
});
