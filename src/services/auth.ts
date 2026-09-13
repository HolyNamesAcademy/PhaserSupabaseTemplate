import type { User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';

export type AuthResult = {
  user: User | null;
  error: string | null;
};

function missingConfigError(): AuthResult {
  return {
    user: null,
    error:
      'Supabase is not configured. Copy .env.example to .env and add your project URL and anon key.',
  };
}

export async function signUp(
  email: string,
  password: string,
  username: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return missingConfigError();
  }

  const trimmedUsername = username.trim();
  if (!trimmedUsername) {
    return { user: null, error: 'Username is required.' };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        username: trimmedUsername,
      },
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return missingConfigError();
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

export async function signOut(): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  return data.user;
}

export function getDisplayName(user: User | null | undefined): string {
  if (!user) {
    return 'Player';
  }

  const fromMetadata = user.user_metadata?.username;
  if (typeof fromMetadata === 'string' && fromMetadata.trim()) {
    return fromMetadata.trim();
  }

  return user.email?.split('@')[0] ?? 'Player';
}
