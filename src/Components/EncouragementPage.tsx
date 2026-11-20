import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

type Tab = 'testimonies' | 'praise';

const testimonyTopics = ['All', 'Healing', 'Faith', 'Provision', 'Family', 'Breakthrough', 'Other'];
const praiseTopics = ['All', 'Worship', 'Gratitude', 'Answered Prayer', 'Joy', 'Peace', 'Other'];

interface Post {
  id: number;
  kind: 'testimony' | 'praise';
  name: string;
  body: string;
  topics: string[];
  is_anonymous: boolean;
  is_approved: boolean;
}

export default function EncouragementPage({ isAdmin = false }: { isAdmin?: boolean }) {
  const [tab, setTab] = useState<Tab>('testimonies');
  const [selectedTestimonyTopic, setSelectedTestimonyTopic] = useState('All');
  const [selectedPraiseTopic, setSelectedPraiseTopic] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formConsent, setFormConsent] = useState(false);
  const [formTopics, setFormTopics] = useState<string[]>([]);
  const [formAnonymous, setFormAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('encouragement_posts')
      .select('id, kind, name, body, topics, is_anonymous, is_approved')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching encouragement posts:', error.message);
    setPosts((data as Post[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function approve(id: number) {
    const { error } = await supabase.from('encouragement_posts').update({ is_approved: true }).eq('id', id);
    if (error) return window.alert('Failed to approve.');
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, is_approved: true } : p)));
  }

  async function remove(id: number) {
    if (!window.confirm('Delete this submission? This cannot be undone.')) return;
    const { error } = await supabase.from('encouragement_posts').delete().eq('id', id);
    if (error) return window.alert('Failed to delete.');
    setPosts(prev => prev.filter(p => p.id !== id));
  }

  const topics = tab === 'testimonies' ? testimonyTopics : praiseTopics;
  const selectedTopic = tab === 'testimonies' ? selectedTestimonyTopic : selectedPraiseTopic;
  const setSelectedTopic = tab === 'testimonies' ? setSelectedTestimonyTopic : setSelectedPraiseTopic;
  const kind = tab === 'testimonies' ? 'testimony' : 'praise';
  const entries = posts.filter(p => p.kind === kind);

  const filtered = selectedTopic === 'All'
    ? entries
    : entries.filter(e => e.topics?.includes(selectedTopic));

  const description = tab === 'testimonies'
    ? 'Share what God has done in your life! Testimonies encourage the body of Christ and remind us that God is still moving. Browse by topic or submit your own testimony below.'
    : 'Give God the glory! This is a place to lift up praises for what He has done, is doing, and will do. Browse praises by topic or share your own.';

  const canSubmit = Boolean(formName.trim() && formBody.trim() && formTopics.length > 0 && formConsent) && !submitting;

  const clearForm = () => {
    setFormName('');
    setFormBody('');
    setFormConsent(false);
    setFormTopics([]);
    setFormAnonymous(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(false);
    const payload = {
      public_id: crypto.randomUUID(),
      kind,
      name: formName.trim(),
      body: formBody.trim(),
      topics: formTopics,
      is_anonymous: formAnonymous,
      consent: formConsent,
    };
    const { error } = await supabase.from('encouragement_posts').insert(payload);
    setSubmitting(false);
    if (error) {
      console.error('Encouragement insert error:', error);
      setSubmitError(true);
      return;
    }
    supabase.functions.invoke('notify-encouragement-post', {
      body: { ...payload, admin_email: import.meta.env.VITE_ADMIN_EMAIL as string | undefined },
    }).catch(() => {});
    clearForm();
    setSubmitSuccess(true);
  };

  const resetFormAndSwitch = (newTab: Tab) => {
    clearForm();
    setSubmitSuccess(false);
    setSubmitError(false);
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

        {submitSuccess && (
          <div className="bg-accent rounded-xl px-5 py-4 mb-5 flex items-center justify-between gap-4">
            <p className="text-white text-sm m-0">Thank you for sharing! It will appear once the ministry has reviewed it.</p>
            <button onClick={() => setSubmitSuccess(false)} className="text-white bg-transparent border-none cursor-pointer text-xl leading-none p-0 shrink-0">×</button>
          </div>
        )}
        {submitError && (
          <div className="bg-red-900/40 rounded-xl px-5 py-4 mb-5">
            <p className="text-red-300 text-sm m-0">Something went wrong. Please try again.</p>
          </div>
        )}

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
          {loading ? (
            <div className="flex items-center justify-center py-12 md:col-span-full">
              <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400 text-center text-sm py-8 md:col-span-full">
              No {tab === 'testimonies' ? 'testimonies' : 'praises'} in this topic yet.
            </p>
          ) : (
            filtered.map(entry => (
              <div key={entry.id} className="bg-slate-800 rounded-xl p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {(entry.topics ?? []).map(t => (
                    <span key={t} className="inline-block bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                  {isAdmin && !entry.is_approved && (
                    <span className="inline-block bg-yellow-600 text-white text-xs font-medium px-3 py-1 rounded-full">Pending</span>
                  )}
                </div>
                <p className="text-white text-sm leading-relaxed m-0 mb-3 whitespace-pre-wrap">{entry.body}</p>
                <p className="text-gray-400 text-xs m-0 italic">
                  {entry.is_anonymous ? 'Anonymous' : entry.name}
                  {isAdmin && entry.is_anonymous && ` (${entry.name})`}
                </p>
                {isAdmin && (
                  <div className="flex gap-2 mt-3">
                    {!entry.is_approved && (
                      <button onClick={() => approve(entry.id)} className="bg-accent text-white border-none rounded-md px-3 py-1 text-xs cursor-pointer">
                        Approve
                      </button>
                    )}
                    <button onClick={() => remove(entry.id)} className="text-white bg-transparent border border-red-400/60 rounded-md px-3 py-1 text-xs cursor-pointer hover:bg-red-500/20">
                      Delete
                    </button>
                  </div>
                )}
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

            <p className="text-gray-300 text-sm m-0 -mb-2">Categories * (select all that apply)</p>
            <div className="flex flex-wrap gap-2">
              {topics.filter(t => t !== 'All').map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border-none cursor-pointer transition-colors ${
                    formTopics.includes(t) ? 'bg-white text-black' : 'bg-slate-900 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <textarea
              placeholder={tab === 'testimonies' ? 'Your testimony *' : 'Your praise *'}
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-base outline-none border border-gray-700 resize-none box-border"
            />

            {/* Anonymous checkbox */}
            <label className="flex items-start gap-3 cursor-pointer" onClick={() => setFormAnonymous(v => !v)}>
              <div className={`w-5 h-5 mt-0.5 rounded shrink-0 border-2 flex items-center justify-center ${formAnonymous ? 'bg-white border-white' : 'bg-transparent border-gray-500'}`}>
                {formAnonymous && (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-7" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-gray-300 text-sm">
                Post anonymously, your name won't appear publicly, but the ministry will still see it.
              </span>
            </label>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer" onClick={() => setFormConsent(v => !v)}>
              <div
                className={`w-5 h-5 mt-0.5 rounded shrink-0 border-2 flex items-center justify-center ${
                  formConsent ? 'bg-white border-white' : 'bg-transparent border-gray-500'
                }`}
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
                onClick={clearForm}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-gray-300 text-base font-semibold border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`flex-1 py-3 rounded-xl text-base font-semibold border-none cursor-pointer ${
                  canSubmit
                    ? 'bg-white text-black'
                    : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!canSubmit}
              >
                {submitting ? 'Sending…' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
