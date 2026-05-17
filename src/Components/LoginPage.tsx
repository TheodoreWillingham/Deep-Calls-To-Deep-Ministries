import { useState } from 'react';

interface LoginPageProps {
  onBack: () => void;
  onGoToSignup: () => void;
}

export default function LoginPage({ onBack, onGoToSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 bg-[#1a1d2e] flex flex-col items-center px-6 pt-20 pb-10 gap-8 overflow-y-auto z-[300]">
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

      <div className="flex flex-col items-center gap-8 w-full max-w-xl">
        <div
          className="font-condensed font-black italic text-4xl leading-[0.85] text-white text-center w-40 cursor-pointer"
          onClick={onBack}
        >
          DEANA BRINGOLF
        </div>

        <h1 className="font-bold text-[28px] text-white self-start w-full mt-4">
          Log in to your account
        </h1>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Email address</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-[#2a2d3e] text-white text-base outline-none"
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-600 bg-[#2a2d3e]">
          <div className="w-6 h-6 rounded border-2 border-gray-500 bg-[#1a1d2e] shrink-0" />
          <span className="text-sm text-white">Verify you are human</span>
        </div>

        <button className="w-full py-5 rounded-xl border-none bg-gray-200 text-lg font-semibold text-gray-700 cursor-pointer">
          Log in
        </button>

        <p className="text-sm text-gray-400 text-center mt-2">
          Need an account?{' '}
          <a className="text-[#e88a4a] cursor-pointer no-underline font-semibold" onClick={onGoToSignup}>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
