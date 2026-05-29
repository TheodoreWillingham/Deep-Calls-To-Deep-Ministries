import { useState } from 'react';
import { supabase } from './supabaseClient';

interface SignupPageProps {
  onBack: () => void;
  onGoToLogin: () => void;
  onLoggedIn: (isAdmin: boolean) => void;
}

export default function SignupPage({ onBack, onGoToLogin, onLoggedIn }: SignupPageProps) {
  const [email, setEmail] = useState('');
  // const [firstName, setFirstName] = useState('');
  // const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !password ) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        // options: {
        //   data: {
        //     first_name: firstName.trim(),
        //     last_name: lastName.trim(),
        //   },
        // },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        onLoggedIn(false);
      } else {
        setInfo('Account created. Please check your email to confirm your address, then log in.');
      }
    } catch (err: any) {
      console.error('Signup error:', err.message);
      setError(err.message || 'Failed to create account.');
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
        <div
          className="font-condensed font-black italic text-4xl leading-[0.85] text-white text-center w-40 cursor-pointer"
          onClick={onBack}
        >
          DEANA BRINGOLF
        </div>

        <h1 className="font-bold text-[28px] text-white self-start w-full mt-4">
          Create an account
        </h1>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Email address</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-slate-800 text-white text-base outline-none"
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        {/* <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">First name</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-slate-800 text-white text-base outline-none"
            type="text"
            placeholder="First"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
            required
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Last name</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-slate-800 text-white text-base outline-none"
            type="text"
            placeholder="Last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            autoComplete="family-name"
            required
          />
        </div> */}

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Password</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-slate-800 text-white text-base outline-none"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Confirm password</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-slate-800 text-white text-base outline-none"
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm self-start w-full m-0">{error}</p>
        )}
        {info && (
          <p className="text-green-400 text-sm self-start w-full m-0">{info}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-5 rounded-xl border-none bg-gray-200 text-lg font-semibold text-gray-700 cursor-pointer disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>

        <p className="text-sm text-gray-400 text-center mt-2">
          Have an account?{' '}
          <a className="text-link cursor-pointer no-underline font-semibold" onClick={onGoToLogin}>
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
