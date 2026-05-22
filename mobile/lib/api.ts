import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// NovelStack mobile API client. Replaces the Supabase SDK: a thin fetch
// wrapper over the HTTP API, with the session JWT kept in AsyncStorage.

const BASE_URL: string =
  (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl ??
  'https://novelstack.app';

const SESSION_KEY = 'novelstack_session';

// Requests fail fast rather than hanging on a stalled connection.
const REQUEST_TIMEOUT_MS = 15000;

// In-memory cache of the JWT so we don't hit AsyncStorage on every request.
let cachedToken: string | null = null;
let loaded = false;

async function ensureLoaded(): Promise<void> {
  if (loaded) return;
  cachedToken = await AsyncStorage.getItem(SESSION_KEY);
  loaded = true;
}

export async function getSessionToken(): Promise<string | null> {
  await ensureLoaded();
  return cachedToken;
}

export async function setSessionToken(token: string): Promise<void> {
  cachedToken = token;
  loaded = true;
  await AsyncStorage.setItem(SESSION_KEY, token);
}

export async function clearSession(): Promise<void> {
  cachedToken = null;
  loaded = true;
  await AsyncStorage.removeItem(SESSION_KEY);
}

// Shared request core. Attaches the Bearer token when one is stored, parses
// JSON, and throws an Error carrying the API's `error` message on non-2xx.
async function request<T>(path: string, init: RequestInit): Promise<T> {
  const token = await getSessionToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...init, headers, signal: controller.signal });
  } catch (e) {
    if (controller.signal.aborted) {
      throw new Error("Couldn't reach NovelStack — check your connection and try again.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : null) ?? `Request failed (${res.status}).`;
    throw new Error(message);
  }
  return data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function apiSend<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown,
): Promise<T> {
  return request<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
