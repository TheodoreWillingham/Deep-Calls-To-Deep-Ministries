import { useState } from 'react';

type Tab = 'testimonies' | 'praise';

const testimonyTopics = ['All', 'Healing', 'Faith', 'Provision', 'Family', 'Breakthrough'];
const praiseTopics = ['All', 'Worship', 'Gratitude', 'Answered Prayer', 'Joy', 'Peace'];

interface TestimonyEntry {
  name: string;
  body: string;
  topic: string;
}

// Placeholder data — will be replaced with Supabase queries
const sampleTestimonies: TestimonyEntry[] = [
  { name: 'Sarah M.', body: 'God healed me from a condition doctors said was permanent. I am forever grateful for His mercy and the prayers of this ministry.', topic: 'Healing' },
  { name: 'James T.', body: 'After months of seeking, the Lord opened a door I never expected. He is faithful!', topic: 'Breakthrough' },
];

const samplePraises: TestimonyEntry[] = [
  { name: 'Maria L.', body: 'Thank you Lord for answered prayers over my family. You are so good!', topic: 'Answered Prayer' },
  { name: 'David K.', body: 'I just want to praise God for the peace He has given me in the middle of the storm.', topic: 'Peace' },
];

export default function EncouragementPage() {
  const [tab, setTab] = useState<Tab>('testimonies');
  const [selectedTestimonyTopic, setSelectedTestimonyTopic] = useState('All');
  const [selectedPraiseTopic, setSelectedPraiseTopic] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formConsent, setFormConsent] = useState(false);

  const topics = tab === 'testimonies' ? testimonyTopics : praiseTopics;
  const selectedTopic = tab === 'testimonies' ? selectedTestimonyTopic : selectedPraiseTopic;
  const setSelectedTopic = tab === 'testimonies' ? setSelectedTestimonyTopic : setSelectedPraiseTopic;
  const entries = tab === 'testimonies' ? sampleTestimonies : samplePraises;

  const filtered = selectedTopic === 'All'
    ? entries
    : entries.filter(e => e.topic === selectedTopic);

  const description = tab === 'testimonies'
    ? 'Share what God has done in your life! Testimonies encourage the body of Christ and remind us that God is still moving. Browse by topic or submit your own testimony below.'
    : 'Give God the glory! This is a place to lift up praises for what He has done, is doing, and will do. Browse praises by topic or share your own.';

  const handleSubmit = () => {
    if (!formName.trim() || !formBody.trim()) return;
    // TODO: submit to Supabase
    setFormName('');
    setFormBody('');
    setFormConsent(false);
    setShowForm(false);
  };

  const resetFormAndSwitch = (newTab: Tab) => {
    setShowForm(false);
    setFormName('');
    setFormBody('');
    setFormConsent(false);
    setTab(newTab);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-20 md:pt-24 stagger-rise">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4 flex items-center justify-center shrink-0">
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center">
          Encouragement Center
        </h1>
      </div>

      {/* Tab switcher */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 flex gap-3 md:gap-4 md:justify-center shrink-0">
        <button
          onClick={() => resetFormAndSwitch('testimonies')}
          className={`flex-1 md:flex-none md:min-w-[200px] py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg border-none cursor-pointer transition-colors ${
            tab === 'testimonies'
              ? 'bg-white text-black'
              : 'bg-slate-800 text-gray-400'
          }`}
        >
          Testimonies
        </button>
        <button
          onClick={() => resetFormAndSwitch('praise')}
          className={`flex-1 md:flex-none md:min-w-[200px] py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg border-none cursor-pointer transition-colors ${
            tab === 'praise'
              ? 'bg-white text-black'
              : 'bg-slate-800 text-gray-400'
          }`}
        >
          Praise
        </button>
      </div>

      {/* Scrollable content area */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-4 md:pt-8 pb-28">
        {/* Description box */}
        <div className="bg-accent/20 rounded-xl px-5 py-4 md:px-7 md:py-6 mb-5 md:mb-8">
          <p className="text-white text-sm md:text-base leading-relaxed m-0">{description}</p>
        </div>

        {/* Topic filters */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-5 md:mb-8">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-none cursor-pointer transition-colors ${
                selectedTopic === topic
                  ? 'bg-white text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-4 mb-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:mb-8 md:items-start">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center text-sm py-8 md:col-span-full">
              No {tab === 'testimonies' ? 'testimonies' : 'praises'} in this topic yet.
            </p>
          ) : (
            filtered.map((entry, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-5 md:p-6">
                <span className="inline-block bg-accent text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                  {entry.topic}
                </span>
                <p className="text-white text-sm leading-relaxed m-0 mb-3">{entry.body}</p>
                <p className="text-gray-400 text-xs m-0 italic">{entry.name}</p>
              </div>
            ))
          )}
        </div>

        {/* Submit form toggle */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full md:max-w-md md:mx-auto md:block py-4 md:py-5 rounded-xl bg-accent hover:bg-accent-hover text-white text-base md:text-lg font-semibold border-none cursor-pointer transition-colors"
          >
            Share Your {tab === 'testimonies' ? 'Testimony' : 'Praise'}
          </button>
        ) : (
          <div className="bg-slate-800 rounded-xl p-5 md:p-7 flex flex-col gap-4 md:max-w-2xl md:mx-auto">
            <h3 className="text-white font-semibold text-lg m-0">
              Submit Your {tab === 'testimonies' ? 'Testimony' : 'Praise'}
            </h3>

            <input
              type="text"
              placeholder="Name *"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-base outline-none border border-gray-700 box-border"
            />

            <textarea
              placeholder={tab === 'testimonies' ? 'Your testimony *' : 'Your praise *'}
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-base outline-none border border-gray-700 resize-none box-border"
            />

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                className={`w-5 h-5 mt-0.5 rounded shrink-0 border-2 flex items-center justify-center ${
                  formConsent ? 'bg-white border-white' : 'bg-transparent border-gray-500'
                }`}
                onClick={() => setFormConsent(!formConsent)}
              >
                {formConsent && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-7" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-gray-300 text-sm">
                I consent to this {tab === 'testimonies' ? 'testimony' : 'praise'} being shared online.
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormName('');
                  setFormBody('');
                  setFormConsent(false);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-gray-300 text-base font-semibold border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`flex-1 py-3 rounded-xl text-base font-semibold border-none cursor-pointer ${
                  formName.trim() && formBody.trim()
                    ? 'bg-white text-black'
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!formName.trim() || !formBody.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
