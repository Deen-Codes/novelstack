import { useEffect, useState } from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

// Mail apps NovelStack can hand the reader off to after sending a magic link.
// `domains` maps the part after the @ to a provider, so we offer the reader's
// OWN provider app — and only that — alongside the system Mail app. Nothing
// else: an Outlook address should never see a Gmail button. Schemes are also
// declared in app.json → ios.infoPlist.LSApplicationQueriesSchemes.
type MailApp = { key: string; name: string; scheme: string; domains: string[] };

// The system Mail app — always offered. It opens whatever account(s) the
// reader has set up on the device, whatever the provider.
const SYSTEM_MAIL: MailApp = {
  key: 'apple',
  name: 'Mail',
  scheme: 'message://',
  domains: ['icloud.com', 'me.com', 'mac.com'],
};

// Email providers that ship their own iOS app we can deep-link into.
const PROVIDER_APPS: MailApp[] = [
  {
    key: 'gmail',
    name: 'Gmail',
    scheme: 'googlegmail://',
    domains: ['gmail.com', 'googlemail.com'],
  },
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
  {
    key: 'proton',
    name: 'Proton Mail',
    scheme: 'protonmail://',
    domains: ['proton.me', 'protonmail.com', 'pm.me'],
  },
  {
    key: 'fastmail',
    name: 'Fastmail',
    scheme: 'fastmail://',
    domains: ['fastmail.com', 'fastmail.fm'],
  },
];

// The provider app matching an email's domain — or null when the domain is
// unknown, or it's iCloud (iCloud mail lives in the system Mail app).
function providerFor(email: string): MailApp | null {
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return null;
  return PROVIDER_APPS.find((a) => a.domains.includes(domain)) ?? null;
}

// After a magic link is sent, offer just the reader's own mail app (matched
// from their email domain, when it's installed) plus the system Mail app.
export function MailAppLinks({ email }: { email: string }) {
  const [providerApp, setProviderApp] = useState<MailApp | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const provider = providerFor(email);
      if (!provider) {
        if (!cancelled) setProviderApp(null);
        return;
      }
      // Only surface the provider's app if it's actually installed —
      // otherwise the system Mail app handles that account anyway.
      let installed = false;
      try {
        installed = await Linking.canOpenURL(provider.scheme);
      } catch {
        installed = false;
      }
      if (!cancelled) setProviderApp(installed ? provider : null);
    })();
    return () => {
      cancelled = true;
    };
  }, [email]);

  async function open(app: MailApp) {
    try {
      await Linking.openURL(app.scheme);
    } catch {
      // App not available — nothing to do.
    }
  }

  // The reader's own provider app first (when known + installed), then the
  // system Mail app — at most two buttons, both relevant.
  const apps = providerApp ? [providerApp, SYSTEM_MAIL] : [SYSTEM_MAIL];

  return (
    <View style={styles.wrap}>
      {apps.map((app, i) => (
        <Pressable
          key={app.key}
          style={i === 0 ? styles.btn : styles.btnOutline}
          onPress={() => open(app)}
        >
          <Text style={i === 0 ? styles.btnText : styles.btnOutlineText}>Open {app.name}</Text>
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
