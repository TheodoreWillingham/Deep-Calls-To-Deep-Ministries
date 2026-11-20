import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import BeStillFormModal, { type BeStillMoment } from './BeStillFormModal';

type Tab = 'requests' | 'bestill';

interface PrayerRequestRow {
  id: string;
  name: string | null;
  request_text: string;
  is_anonymous: boolean;
  has_been_prayed_for: boolean;
  created_at: string;
}

/* ── localStorage helpers ── */

const PRAYED_KEY = 'dcdt_prayed_requests';

function getPrayedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(PRAYED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function savePrayedId(id: string) {
  try {
    const ids = getPrayedIds();
    ids.add(id);
    localStorage.setItem(PRAYED_KEY, JSON.stringify([...ids]));
  } catch { /* storage unavailable */ }
}

/* ── Icons ── */

function PrayingHandsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* two palms pressed together, fingertips up, with sleeves flaring at the wrists */}
      <path d="M12 2.5C9.8 5 8.5 7.8 8.5 10.5V15l-4 3.5 3 3H12" />
      <path d="M12 2.5C14.2 5 15.5 7.8 15.5 10.5V15l4 3.5-3 3H12" />
      <path d="M12 2.5v19" />
    </svg>
  );
}

/* ── Main Component ── */

export default function PrayerPage({ isAdmin = false }: { isAdmin?: boolean }) {
  const [tab, setTab] = useState<Tab>('requests');

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 md:pt-24 stagger-rise">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4 flex items-center justify-center shrink-0">
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center">Prayer</h1>
      </div>

      {/* Tab switcher */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 flex gap-2 md:gap-4 shrink-0">
        {([
          ['requests', 'Requests'],
          ['bestill', 'Be Still'],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base border-none cursor-pointer transition-colors ${
              tab === key
                ? 'bg-white text-black'
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-4 md:pt-8 pb-28">
        {tab === 'requests' && <PrayerRequestsTab />}
        {tab === 'bestill' && <BeStillTab isAdmin={isAdmin} />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Tab 1: Prayer Requests
   ════════════════════════════════════════════════════════ */

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer" onClick={onChange}>
      <div className={`w-5 h-5 mt-0.5 rounded shrink-0 border-2 flex items-center justify-center ${checked ? 'bg-white border-white' : 'bg-transparent border-gray-500'}`}>
        {checked && (
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-6" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-gray-300 text-sm leading-snug">{label}</span>
    </label>
  );
}

function PrayerRequestsTab() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [requestText, setRequestText] = useState('');
  const [showOnWebsite, setShowOnWebsite] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [requests, setRequests] = useState<PrayerRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [prayedIds, setPrayedIds] = useState<Set<string>>(() => getPrayedIds());

  useEffect(() => {
    supabase
      .from('prayer_requests')
      .select('id, name, request_text, is_anonymous, has_been_prayed_for, created_at')
      .eq('is_approved', true)
      .eq('show_on_website', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRequests(data ?? []);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setName('');
    setIsAnonymous(false);
    setRequestText('');
    setShowOnWebsite(false);
    setSubmitError(false);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!requestText.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(false);

    // 1. Generate the ID in the browser so we don't have to ask the database for it
    const newRequestId = crypto.randomUUID();

    // 2. Insert the row without calling .select() at the end
    const { error } = await supabase
      .from('prayer_requests')
      .insert({
        id: newRequestId,
        name: name.trim() || null,
        request_text: requestText.trim(),
        is_anonymous: isAnonymous,
        show_on_website: showOnWebsite,
      }); 

    if (error) {
      console.error('Prayer request insert error:', error);
      setSubmitting(false);
      setSubmitError(true);
      return;
    }

    // 3. Pass the ID we generated to the email function
    supabase.functions.invoke('notify-prayer-request', {
      body: {
        id: newRequestId,
        name: name.trim() || null,
        request_text: requestText.trim(),
        is_anonymous: isAnonymous,
        show_on_website: showOnWebsite,
        admin_email: import.meta.env.VITE_ADMIN_EMAIL as string | undefined,
      },
    }).catch(() => {});

    setSubmitting(false);
    setSubmitSuccess(true);
    resetForm();
  };

  const handlePray = async (id: string) => {
    if (prayedIds.has(id)) return;
    
    // 1. Optimistically update the UI so it feels snappy
    savePrayedId(id);
    setPrayedIds(prev => new Set([...prev, id]));
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, has_been_prayed_for: true } : r),
    );
    
    // 2. Wait for the database response and catch any errors
    const { error } = await supabase.rpc('mark_prayer_prayed_for', { request_id: id });
    
    if (error) {
      console.error("Failed to update prayer status in Supabase:", error);
      // If you want, you could revert the UI state here, but for now let's just log the error.
    }
  };

  return (
    <>
      {/* Description */}
      <div className="bg-accent/20 rounded-xl px-5 py-4 md:px-7 md:py-6 mb-5 md:mb-8">
        <p className="text-white text-sm md:text-base leading-relaxed m-0">
          Need prayer? We've got you covered. Submit your prayer request below and our ministry will lift you up. You can also pray for others, tap the prayer hands to let them know someone is praying.
        </p>
      </div>

      {/* Success banner */}
      {submitSuccess && (
        <div className="bg-accent rounded-xl px-5 py-4 mb-5 flex items-center justify-between gap-4">
          <p className="text-white text-sm m-0">Your prayer request has been received. We'll be lifting you up!</p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="text-white bg-transparent border-none cursor-pointer text-xl leading-none p-0 shrink-0"
          >
            ×
          </button>
        </div>
      )}

      {/* Error banner */}
      {submitError && (
        <div className="bg-red-900/40 rounded-xl px-5 py-4 mb-5">
          <p className="text-red-300 text-sm m-0">Something went wrong. Please try again.</p>
        </div>
      )}

      {/* Form toggle */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full md:max-w-md md:mx-auto md:block py-4 md:py-5 rounded-xl bg-accent hover:bg-accent-hover text-white text-base md:text-lg font-semibold border-none cursor-pointer mb-5 md:mb-8 transition-colors"
        >
          Submit a Prayer Request
        </button>
      ) : (
        <div className="bg-slate-800 rounded-xl p-5 md:p-7 flex flex-col gap-4 mb-5 md:mb-8 md:max-w-3xl md:mx-auto">
          <h3 className="text-white font-semibold text-lg m-0">Your Prayer Request</h3>

          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-base outline-none border border-gray-700 box-border"
          />

          <Checkbox
            checked={isAnonymous}
            onChange={() => setIsAnonymous(v => !v)}
            label="Post anonymously, your name won't appear publicly, but the ministry will still see it"
          />

          <textarea
            placeholder="How can we pray for you?"
            value={requestText}
            onChange={e => setRequestText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-base outline-none border border-gray-700 resize-none box-border"
          />

          <Checkbox
            checked={showOnWebsite}
            onChange={() => setShowOnWebsite(v => !v)}
            label="Allow this prayer to be shared on the website (reviewed by the ministry before posting)"
          />

          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-gray-300 text-base font-semibold border-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!requestText.trim() || submitting}
              className={`flex-1 py-3 rounded-xl text-base font-semibold border-none cursor-pointer ${
                requestText.trim() && !submitting
                  ? 'bg-white text-black'
                  : 'bg-slate-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Sending…' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Prayer request cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-400 text-center text-sm py-12">
          No prayer requests have been shared yet. Be the first to submit one.
        </p>
      ) : (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 md:items-start">
          {requests.map(pr => {
            const hasPrayed = prayedIds.has(pr.id);
            const displayName = pr.is_anonymous ? 'Anonymous' : (pr.name?.trim() || 'Anonymous');
            return (
              <div key={pr.id} className="bg-slate-800 rounded-xl p-5 md:p-6 flex flex-col">
                <p className="text-white text-sm md:text-base leading-relaxed m-0 mb-3 flex-1">{pr.request_text}</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-gray-400 text-xs m-0 italic">{displayName}</p>
                  <button
                    onClick={() => handlePray(pr.id)}
                    disabled={hasPrayed}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-none cursor-pointer text-sm font-medium transition-colors shrink-0 ${
                      hasPrayed
                        ? 'bg-accent text-white cursor-default'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <PrayingHandsIcon className="w-4 h-4" />
                    <span>{hasPrayed ? 'Prayed For' : 'Pray For'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════
   Tab 2: Be Still Moments
   ════════════════════════════════════════════════════════ */

function BeStillTab({ isAdmin }: { isAdmin: boolean }) {
  const [moments, setMoments] = useState<BeStillMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BeStillMoment | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function fetchMoments() {
    const { data, error } = await supabase
      .from('be_still_moments')
      .select('id, title, pray, rest, action, yield_text')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching be still moments:', error.message);
    setMoments((data as BeStillMoment[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchMoments();
  }, []);

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleDelete(m: BeStillMoment) {
    if (!window.confirm(`Delete "${m.title || 'this Be Still moment'}"? This cannot be undone.`)) return;
    setDeletingId(m.id);
    const { error } = await supabase.from('be_still_moments').delete().eq('id', m.id);
    setDeletingId(null);
    if (error) {
      console.error('Error deleting be still moment:', error.message);
      window.alert('Failed to delete.');
      return;
    }
    setMoments(prev => prev.filter(x => x.id !== m.id));
  }

  return (
    <>
      <div className="bg-accent/20 rounded-xl px-5 py-4 md:px-7 md:py-6 mb-5 md:mb-8">
        <p className="text-white text-sm md:text-base leading-relaxed m-0">
          Take a moment to pause, breathe, and be still with God. These devotional moments are designed to quiet your heart and draw you into His presence. "Be still, and know that I am God." (Psalm 46:10)
        </p>
      </div>

      {isAdmin && (
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="w-full md:max-w-md md:mx-auto md:block py-3 rounded-xl bg-accent hover:bg-accent-hover text-white text-base font-semibold border-none cursor-pointer mb-5 md:mb-8 transition-colors"
        >
          + Add Be Still Moment
        </button>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
        </div>
      ) : moments.length === 0 ? (
        <p className="text-gray-400 text-center text-sm py-8">
          New Be Still moments coming soon. Check back!
        </p>
      ) : (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 md:items-start">
          {moments.map(m => (
            <div key={m.id} className="bg-slate-800 rounded-xl overflow-hidden">
              <div className="bg-accent px-5 md:px-6 py-4 flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-semibold tracking-widest uppercase m-0">Be Still Moment</p>
                  {m.title && <h3 className="text-white font-bold text-lg m-0 mt-1">{m.title}</h3>}
                </div>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => { setEditing(m); setShowForm(true); }}
                      className="text-white bg-transparent border border-white/40 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      disabled={deletingId === m.id}
                      className="text-white bg-transparent border border-red-400/60 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {deletingId === m.id ? '...' : 'Delete'}
                    </button>
                  </>
                )}
              </div>
              <div className="px-5 md:px-6 py-4 md:py-5 flex flex-col gap-4">
                {([
                  ['Pray', m.pray],
                  ['Rest', m.rest],
                  ['Action', m.action],
                  ['Yield', m.yield_text],
                ] as [string, string][]).filter(([, text]) => text).map(([label, text]) => (
                  <p key={label} className="text-gray-300 text-sm leading-relaxed m-0 whitespace-pre-wrap">
                    <span className="text-white font-bold tracking-wide">{label.toUpperCase()}:</span> {text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BeStillFormModal
          moment={editing}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            setLoading(true);
            fetchMoments();
          }}
        />
      )}
    </>
  );
}
