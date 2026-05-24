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

// Image uploads carry a multi-MB body and round-trip through R2 storage, so
// they get a far longer budget than an ordinary JSON request.
const UPLOAD_TIMEOUT_MS = 60000;

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
  bustCaches();
  await AsyncStorage.setItem(SESSION_KEY, token);
}

export async function clearSession(): Promise<void> {
  cachedToken = null;
  loaded = true;
  bustCaches();
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

// --- In-memory GET cache --------------------------------------------------
// Re-entering a screen — or opening another screen that reads the same
// endpoint — is served instantly from here instead of waiting on the
// network. Any mutation (apiSend / apiUpload) clears the cache, and sign in
// / sign out clears it too, so reads never go stale.
type CacheEntry = { at: number; data: unknown };
const getCache = new Map<string, CacheEntry>();

// Bumped on every mutation so other in-memory caches (the signed-in user in
// lib/auth) can tell when their data may be out of date.
let mutationSeq = 0;
export function mutationSeqNo(): number {
  return mutationSeq;
}

function bustCaches(): void {
  getCache.clear();
  mutationSeq += 1;
}

// Like apiGet, but serves a recent response from memory when one exists.
// `ttlMs` controls how long a cached response stays fresh (default 60s).
export async function apiGetCached<T>(path: string, ttlMs = 60000): Promise<T> {
  const hit = getCache.get(path);
  if (hit && Date.now() - hit.at < ttlMs) {
    return hit.data as T;
  }
  const data = await apiGet<T>(path);
  getCache.set(path, { at: Date.now(), data });
  return data;
}

export async function apiSend<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  body?: unknown,
): Promise<T> {
  const result = await request<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  // A write may have changed anything — drop cached reads so the next
  // fetch reflects the new state.
  bustCaches();
  return result;
}

// Uploads a local image file (multipart/form-data). The Content-Type header
// is deliberately left unset so fetch adds the multipart boundary itself.
export async function apiUpload<T>(
  path: string,
  file: { uri: string; name: string; type: string },
): Promise<T> {
  const token = await getSessionToken();
  const form = new FormData();
  // React Native's FormData accepts this {uri,name,type} shape for files.
  form.append('file', file as unknown as Blob);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      body: form,
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: controller.signal,
    });
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
        : null) ?? `Upload failed (${res.status}).`;
    throw new Error(message);
  }
  bustCaches();
  return data as T;
}
