import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const supabase = createClient(
  extra.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  extra.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // PKCE: the magic link comes back as ?code=… on the novelstack://
      // deep link. app/auth-callback.tsx exchanges that code for a session.
      flowType: 'pkce',
    },
  }
);
