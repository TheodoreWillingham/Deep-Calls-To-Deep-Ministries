import { useState } from 'react';
import { supabase } from './supabaseClient';

interface Event {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  event_date: string;
  event_time: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

interface EventFormModalProps {
  event: Event | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function EventFormModal({ event, onClose, onSaved }: EventFormModalProps) {
  const isEdit = event !== null;

  const [name, setName] = useState(event?.name ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [eventDate, setEventDate] = useState(event?.event_date ?? '');
  const [eventTime, setEventTime] = useState(event?.event_time ?? '');
  const [contactName, setContactName] = useState(event?.contact_name ?? '');
  const [contactEmail, setContactEmail] = useState(event?.contact_email ?? '');
  const [contactPhone, setContactPhone] = useState(event?.contact_phone ?? '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Event name is required.');
      return;
    }
    if (!eventDate) {
      setError('Event date is required.');
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      location: location.trim() || null,
      event_date: eventDate,
      event_time: eventTime || null,
      contact_name: contactName.trim() || null,
      contact_email: contactEmail.trim() || null,
      contact_phone: contactPhone.trim() || null,
    };

    try {
      if (isEdit && event) {
        const { error: updateError } = await supabase
          .from('events')
          .update(payload)
          .eq('id', event.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('events')
          .insert([payload]);
        if (insertError) throw insertError;
      }
      onSaved();
    } catch (err: any) {
      console.error('Error saving event:', err.message);
      setError(err.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto pt-20 md:pt-28 pb-10 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-accent px-5 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg m-0">
            {isEdit ? 'Edit Event' : 'Add Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-white bg-transparent border-none cursor-pointer p-0"
            aria-label="Close"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <Field label="Name *">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm"
              required
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm resize-y"
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm"
            />
          </Field>

          <div className="flex gap-3">
            <Field label="Date *" className="flex-1">
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm"
                required
              />
            </Field>
            <Field label="Time" className="flex-1">
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm"
              />
            </Field>
          </div>

          <div className="border-t border-gray-700 pt-4 flex flex-col gap-4">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Contact</span>

            <Field label="Contact Name">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm"
              />
            </Field>

            <Field label="Contact Email">
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm"
              />
            </Field>

            <Field label="Contact Phone">
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:border-white outline-none text-sm"
              />
            </Field>
          </div>

          {error && (
            <p className="text-red-400 text-sm m-0">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 bg-transparent border border-gray-600 text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-accent hover:bg-accent-hover border-none text-white rounded-lg py-2 text-sm cursor-pointer disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, className = '', children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className="text-gray-300 text-xs font-semibold">{label}</span>
      {children}
    </label>
  );
}
