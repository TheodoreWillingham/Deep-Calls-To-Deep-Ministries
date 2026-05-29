import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

type Tab = 'requests' | 'bestill' | 'gospel';

interface PrayerRequestRow {
  id: string;
  name: string | null;
  request_text: string;
  is_anonymous: boolean;
  has_been_prayed_for: boolean;
  created_at: string;
}

interface BeStillMoment {
  id: number;
  title: string;
  description: string;
  type: 'audio' | 'video';
  duration: string;
}

const sampleMoments: BeStillMoment[] = [
  { id: 1, title: 'Rest in His Presence', description: 'A guided moment of stillness focusing on Psalm 46:10 — "Be still, and know that I am God."', type: 'audio', duration: '5 min' },
  { id: 2, title: 'Peace That Surpasses Understanding', description: 'Let the Lord quiet your heart as we meditate on Philippians 4:6-7.', type: 'audio', duration: '8 min' },
];

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

function PlayCircleIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="1.5" />
      <polygon points="16,12 28,20 16,28" fill="white" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5">
      <path d="M8 24v-4a12 12 0 0 1 24 0v4" />
      <rect x="4" y="24" width="6" height="8" rx="2" />
      <rect x="30" y="24" width="6" height="8" rx="2" />
    </svg>
  );
}

function PrayingHandsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L8 12l4 10M12 2l4 10-4 10" />
    </svg>
  );
}

/* ── Main Component ── */

export default function PrayerPage() {
  const [tab, setTab] = useState<Tab>('requests');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-20 md:pt-24">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4 flex items-center justify-center shrink-0">
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center">Prayer</h1>
      </div>

      {/* Tab switcher */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 flex gap-2 md:gap-4 shrink-0">
        {([
          ['requests', 'Requests'],
          ['bestill', 'Be Still'],
          ['gospel', 'Know Jesus'],
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
        {tab === 'bestill' && <BeStillTab />}
        {tab === 'gospel' && <GospelTab />}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   Tab 1 — Prayer Requests
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
          Need prayer? We've got you covered. Submit your prayer request below and our ministry will lift you up. You can also pray for others — tap the prayer hands to let them know someone is praying.
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
            label="Post anonymously — your name won't appear publicly, but the ministry will still see it"
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
                    <span>{hasPrayed ? 'Praying' : 'Pray'}</span>
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
   Tab 2 — Be Still Moments
   ════════════════════════════════════════════════════════ */

function BeStillTab() {
  return (
    <>
      {/* Description */}
      <div className="bg-accent/20 rounded-xl px-5 py-4 md:px-7 md:py-6 mb-5 md:mb-8">
        <p className="text-white text-sm md:text-base leading-relaxed m-0">
          Take a moment to pause, breathe, and be still with God. These devotional moments are designed to quiet your heart and draw you into His presence. "Be still, and know that I am God." — Psalm 46:10
        </p>
      </div>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
        {sampleMoments.map(moment => (
          <div key={moment.id} className="bg-slate-800 rounded-xl p-5 md:p-6 flex gap-4 items-start">
            {/* Play/Listen icon */}
            <button className="shrink-0 bg-transparent border-none cursor-pointer p-0 mt-1">
              {moment.type === 'video' ? <PlayCircleIcon /> : <HeadphonesIcon />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                  {moment.type === 'video' ? 'Video' : 'Audio'}
                </span>
                <span className="text-gray-500 text-xs">{moment.duration}</span>
              </div>
              <h3 className="text-white font-semibold text-base m-0 mb-1">{moment.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed m-0">{moment.description}</p>
            </div>
          </div>
        ))}

        {sampleMoments.length === 0 && (
          <p className="text-gray-400 text-center text-sm py-8">
            New Be Still moments coming soon. Check back!
          </p>
        )}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════
   Tab 3 — Do You Know Jesus?
   ════════════════════════════════════════════════════════ */

function GospelTab() {
  return (
    <>
      <div className="md:max-w-3xl md:mx-auto">
      {/* Description */}
      <div className="bg-accent/20 rounded-xl px-5 py-4 md:px-7 md:py-6 mb-5 md:mb-8">
        <p className="text-white text-sm md:text-base leading-relaxed m-0">
          The most important decision you will ever make is about your relationship with Jesus Christ. We want to share with you the good news that has changed everything for us — and can change everything for you too.
        </p>
      </div>

      {/* Gospel content */}
      <div className="bg-slate-800 rounded-xl p-6 md:p-8 mb-5 md:mb-8">
        <h3 className="text-white font-bold text-xl md:text-2xl m-0 mb-4 md:mb-6 text-center">The Good News</h3>

          <div className="flex flex-col gap-5">
            <div>
              <h4 className="text-white font-semibold text-base m-0 mb-1">God Loves You</h4>
              <p className="text-gray-300 text-sm leading-relaxed m-0">
                "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life." — John 3:16
              </p>
            </div>

            <div className="border-t border-gray-700" />

            <div>
              <h4 className="text-white font-semibold text-base m-0 mb-1">We All Need a Savior</h4>
              <p className="text-gray-300 text-sm leading-relaxed m-0">
                "For all have sinned and fall short of the glory of God." — Romans 3:23. Every one of us has fallen short, but God made a way for us through Jesus.
              </p>
            </div>

            <div className="border-t border-gray-700" />

            <div>
              <h4 className="text-white font-semibold text-base m-0 mb-1">Jesus Paid the Price</h4>
              <p className="text-gray-300 text-sm leading-relaxed m-0">
                "But God demonstrates His own love for us in this: While we were still sinners, Christ died for us." — Romans 5:8. Jesus took our place on the cross so we could be forgiven and made right with God.
              </p>
            </div>

            <div className="border-t border-gray-700" />

            <div>
              <h4 className="text-white font-semibold text-base m-0 mb-1">Receive the Gift</h4>
              <p className="text-gray-300 text-sm leading-relaxed m-0">
                "If you declare with your mouth, 'Jesus is Lord,' and believe in your heart that God raised Him from the dead, you will be saved." — Romans 10:9. Salvation is a free gift — all you have to do is believe and receive.
              </p>
            </div>
          </div>
        </div>

      {/* Prayer of salvation */}
      <div className="bg-accent rounded-xl p-6 md:p-8 mb-5 md:mb-8">
        <h3 className="text-white font-bold text-lg md:text-xl m-0 mb-3 text-center">A Prayer to Begin</h3>
        <p className="text-white text-sm md:text-base leading-relaxed m-0 italic text-center">
          "Lord Jesus, I believe You are the Son of God. I believe You died for my sins and rose again. I ask You to forgive me and come into my heart. I surrender my life to You. Thank You for saving me. In Jesus' name, Amen."
        </p>
      </div>

      {/* Next steps */}
      <div className="bg-slate-800 rounded-xl p-6 md:p-8">
        <h3 className="text-white font-bold text-lg md:text-xl m-0 mb-3">What's Next?</h3>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed m-0 mb-4">
          If you've made the decision to follow Jesus — welcome to the family! Here are some important next steps:
        </p>
        <ul className="text-gray-300 text-sm md:text-base leading-relaxed m-0 pl-5 flex flex-col gap-3">
          <li><span className="text-white font-medium">Find a local church</span> — Surround yourself with other believers who can encourage you and help you grow in your faith.</li>
          <li><span className="text-white font-medium">Read the Bible</span> — Start with the book of John to learn more about who Jesus is.</li>
          <li><span className="text-white font-medium">Pray daily</span> — Talk to God like you would a friend. He wants to hear from you.</li>
          <li><span className="text-white font-medium">Get baptized</span> — Baptism is an outward expression of your inward decision to follow Jesus.</li>
        </ul>

        <div className="mt-5 p-4 md:p-5 bg-slate-900 rounded-xl">
          <p className="text-gray-300 text-sm md:text-base m-0 mb-2">
            Need help finding a church or want to talk to someone?
          </p>
          <p className="text-white text-sm md:text-base font-medium m-0">
            Reach out to us — we'd love to help you on your journey.
          </p>
        </div>
      </div>
      </div>
    </>
  );
}
