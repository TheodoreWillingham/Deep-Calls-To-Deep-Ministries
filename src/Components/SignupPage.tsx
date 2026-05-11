import { useState } from 'react';

interface SignupPageProps {
  onBack: () => void;
  onGoToLogin: () => void;
}

export default function SignupPage({ onBack, onGoToLogin }: SignupPageProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="fixed inset-0 bg-[#1a1d2e] flex flex-col items-center px-6 pt-20 pb-10 gap-8 overflow-y-auto z-[300]">
      <div className="flex flex-col items-center gap-8 w-full max-w-xl">
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
            className="w-full p-4 rounded-lg border border-gray-600 bg-[#2a2d3e] text-white text-base outline-none"
            type="email"
            placeholder="name@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">First name</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-[#2a2d3e] text-white text-base outline-none"
            type="text"
            placeholder="First"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Last name</label>
          <input
            className="w-full p-4 rounded-lg border border-gray-600 bg-[#2a2d3e] text-white text-base outline-none"
            type="text"
            placeholder="Last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold text-sm text-gray-300">Phone number</label>
          <div className="flex gap-2 w-full">
            <select className="w-18 shrink-0 p-4 px-2 text-center rounded-lg border border-gray-600 bg-[#2a2d3e] text-white text-base outline-none">
              <option value="US">US</option>
            </select>
            <input
              className="w-full p-4 rounded-lg border border-gray-600 bg-[#2a2d3e] text-white text-base outline-none"
              type="tel"
              placeholder="201 555 0123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-600 bg-[#2a2d3e]">
          <div className="w-6 h-6 rounded border-2 border-gray-500 bg-[#1a1d2e] shrink-0" />
          <span className="text-sm text-white">Verify you are human</span>
        </div>

        <button className="w-full py-5 rounded-xl border-none bg-gray-200 text-lg font-semibold text-gray-700 cursor-pointer">
          Sign up
        </button>

        <p className="text-sm text-gray-400 text-center mt-2">
          Have an account?{' '}
          <a className="text-[#e88a4a] cursor-pointer no-underline font-semibold" onClick={onGoToLogin}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
