import Logo from './Logo';
import { useState } from 'react';
import { supabase } from './supabaseClient';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string;

interface LoginPageProps {
  onBack: () => void;
  onLoggedIn: (isAdmin: boolean) => void;
}

export default function LoginPage({ onBack, onLoggedIn }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter the admin password.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password,
      });
      if (signInError) throw new Error('Incorrect admin password.');

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .single();

      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        throw new Error('This account does not have admin access.');
      }

      onLoggedIn(true);
    } catch (err: any) {
      console.error('Login error:', err.message);
      setError(err.message || 'Failed to log in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center px-6 pt-20 pb-10 gap-8 overflow-y-auto z-[300]">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="absolute top-5 left-5 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12.5 4L6.5 10L12.5 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full max-w-xl stagger-rise">
        <Logo className="w-28 text-white cursor-pointer" onClick={onBack} />

        <h1 className="font-bold text-[28px] text-white self-start w-full mt-4">
          Admin Log In
        </h1>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Admin password</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-slate-800 text-white text-base outline-none"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm self-start w-full m-0">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-5 rounded-xl border-none bg-gray-200 text-lg font-semibold text-gray-700 cursor-pointer disabled:opacity-60"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>

      </form>
    </div>
  );
}
