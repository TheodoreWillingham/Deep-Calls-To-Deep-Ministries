import { useState } from 'react';
import { supabase } from './supabaseClient';

// The author's direct contact details. Any line left empty is hidden.
const CONTACT_INFO = {
  email: '',
  phone: '',
  location: '',
};

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-slate-900 text-white text-base outline-none border border-gray-700 focus:border-white box-border';

export default function ConnectPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasDirectContact = Boolean(CONTACT_INFO.email || CONTACT_INFO.phone || CONTACT_INFO.location);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    // Bots tend to fill every field. Pretend it worked and drop it.
    if (honeypot) {
      setSent(true);
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    // The id is created here because visitors are not allowed to read rows back after saving.
    const id = crypto.randomUUID();
    const { error: insertError } = await supabase.from('contact_submissions').insert({
      id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      message: message.trim() || null,
    });

    if (insertError) {
      console.error('Contact form error:', insertError.message);
      setSubmitting(false);
      setError('Something went wrong. Please try again in a moment.');
      return;
    }

    // Email the author. If this fails the message is still saved, so we don't show an error.
    supabase.functions.invoke('notify-contact-submission', { body: { id } }).catch(() => {});

    setSubmitting(false);
    setSent(true);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setMessage('');
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 md:pt-24 stagger-rise">
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4">
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center">Connect</h1>
      </div>

      <div className="w-full max-w-md md:max-w-5xl px-6 pb-28 flex flex-col gap-6">
        <div className="bg-accent/20 rounded-xl px-5 py-4 md:px-7 md:py-6">
          <p className="text-white text-sm md:text-base leading-relaxed m-0">
            We would love to hear from you. Share your details and we will reach out, or contact us directly using the information below.
          </p>
        </div>

        <div className={`flex flex-col gap-6 ${hasDirectContact ? 'md:grid md:grid-cols-[3fr_2fr] md:items-start md:gap-8' : 'md:max-w-xl md:mx-auto md:w-full'}`}>
          {/* Form */}
          <div className="bg-slate-800 rounded-xl p-5 md:p-7">
            {sent ? (
              <div className="flex flex-col gap-3 py-4 text-center">
                <h2 className="text-white font-semibold text-xl m-0">Thank you!</h2>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed m-0">
                  Your message has been received. We will be in touch soon.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="self-center mt-2 px-5 py-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold border-none cursor-pointer transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                <h2 className="text-white font-semibold text-lg m-0">Get in touch</h2>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <label className="flex flex-col gap-1 flex-1">
                    <span className="text-gray-300 text-xs font-semibold">First name *</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete="given-name"
                      maxLength={100}
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-1 flex-1">
                    <span className="text-gray-300 text-xs font-semibold">Last name *</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete="family-name"
                      maxLength={100}
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-gray-300 text-xs font-semibold">Email *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    maxLength={254}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-gray-300 text-xs font-semibold">Phone (optional)</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    maxLength={40}
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-gray-300 text-xs font-semibold">Message (optional)</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    maxLength={2000}
                    placeholder="How can we help? Share a question, a prayer need, or just say hello."
                    className={`${inputClass} resize-y`}
                  />
                </label>

                {/* Hidden from people; bots tend to fill it in. */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </label>
                </div>

                {error && <p className="text-red-400 text-sm m-0">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-base font-semibold border-none cursor-pointer disabled:opacity-60 transition-colors"
                >
                  {submitting ? 'Sending...' : 'Send'}
                </button>
              </form>
            )}
          </div>

          {/* Direct contact */}
          {hasDirectContact && (
            <div className="bg-slate-800 rounded-xl p-5 md:p-7 flex flex-col gap-4">
              <h2 className="text-white font-semibold text-lg m-0">Prefer to reach out directly?</h2>
              <p className="text-gray-400 text-sm leading-relaxed m-0">
                No need to share your details here. You can contact us any time.
              </p>
              <dl className="m-0 flex flex-col gap-3">
                {CONTACT_INFO.email && (
                  <div>
                    <dt className="text-gray-400 text-xs font-semibold">Email</dt>
                    <dd className="m-0">
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-link break-all">
                        {CONTACT_INFO.email}
                      </a>
                    </dd>
                  </div>
                )}
                {CONTACT_INFO.phone && (
                  <div>
                    <dt className="text-gray-400 text-xs font-semibold">Phone</dt>
                    <dd className="m-0">
                      <a href={`tel:${CONTACT_INFO.phone.replace(/[^+\d]/g, '')}`} className="text-link">
                        {CONTACT_INFO.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {CONTACT_INFO.location && (
                  <div>
                    <dt className="text-gray-400 text-xs font-semibold">Location</dt>
                    <dd className="m-0 text-white">{CONTACT_INFO.location}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
