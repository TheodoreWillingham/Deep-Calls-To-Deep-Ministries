import { useState } from 'react';

const PRESETS = [25, 50, 100, 250, 500];

export default function GivePage() {
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [selected, setSelected] = useState<number | 'custom'>(50);
  const [custom, setCustom] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const amount = selected === 'custom' ? Math.floor(Number(custom)) || 0 : selected;
  const canGive = amount > 0;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-20 md:pt-24 stagger-rise">
      {/* Header */}
      <div className="w-full max-w-2xl px-6 pt-6 md:pt-10 pb-4 flex items-center justify-center">
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center">Give</h1>
      </div>

      {/* Intro */}
      <section className="w-full max-w-2xl px-6 flex flex-col items-center text-center gap-4 mb-8 md:mb-10">
        <h2 className="font-condensed italic text-4xl md:text-6xl text-white leading-[0.9]">
          PARTNER WITH US
        </h2>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          Your generosity helps Deep Calls to Deep Ministries carry the light of God's kingdom into the deepest places—reaching hearts that are longing in the deep.
        </p>
      </section>

      {/* Donation card */}
      <section className="w-full max-w-2xl px-6 pb-6">
        <div className="bg-slate-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          {/* Frequency toggle */}
          <div className="flex gap-2 p-1 bg-slate-900 rounded-xl">
            {([['once', 'One-time'], ['monthly', 'Monthly']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFrequency(key)}
                className={`flex-1 py-2.5 rounded-lg text-sm md:text-base font-semibold border-none cursor-pointer transition-colors ${
                  frequency === key ? 'bg-white text-black' : 'bg-transparent text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Amount selection */}
          <div className="grid grid-cols-3 gap-3">
            {PRESETS.map((value) => (
              <button
                key={value}
                onClick={() => setSelected(value)}
                className={`py-3 rounded-xl text-base font-semibold border cursor-pointer transition-colors ${
                  selected === value
                    ? 'bg-accent border-accent text-white'
                    : 'bg-slate-900 border-gray-700 text-gray-200 hover:border-gray-500'
                }`}
              >
                ${value}
              </button>
            ))}
            <button
              onClick={() => setSelected('custom')}
              className={`py-3 rounded-xl text-base font-semibold border cursor-pointer transition-colors ${
                selected === 'custom'
                  ? 'bg-accent border-accent text-white'
                  : 'bg-slate-900 border-gray-700 text-gray-200 hover:border-gray-500'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom amount input */}
          {selected === 'custom' && (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-900 text-white text-base outline-none border border-gray-700 focus:border-white box-border"
              />
            </div>
          )}

          {/* Give action */}
          {submitted ? (
            <div className="rounded-xl bg-accent/15 border border-accent/40 px-5 py-4 text-center">
              <p className="text-white text-sm md:text-base leading-relaxed m-0">
                Thank you for your heart to give! Secure online giving is on its way—please check back soon, or reach out to the ministry to give today.
              </p>
            </div>
          ) : (
            <button
              onClick={() => { if (canGive) setSubmitted(true); }}
              disabled={!canGive}
              className={`w-full py-4 rounded-xl text-base md:text-lg font-semibold border-none transition-colors ${
                canGive
                  ? 'bg-accent hover:bg-accent-hover text-white cursor-pointer'
                  : 'bg-slate-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canGive ? `Give $${amount}${frequency === 'monthly' ? ' / month' : ''}` : 'Select an amount'}
            </button>
          )}

          <p className="text-gray-500 text-xs text-center m-0">
            Monthly gifts can be changed or canceled at any time.
          </p>
        </div>
      </section>
    </div>
  );
}
