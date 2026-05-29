import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import EventFormModal from './EventFormModal';

interface EventsPageProps {
  isAdmin: boolean;
}

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

function CalendarIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.35a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.75.32 1.54.55 2.35.68A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export default function EventsPage({ isAdmin }: EventsPageProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents((data as Event[]) || []);
    } catch (error: any) {
      console.error('Error fetching events:', error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  function openAddForm() {
    setEditingEvent(null);
    setShowForm(true);
  }

  function openEditForm(event: Event) {
    setEditingEvent(event);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingEvent(null);
  }

  async function handleDelete(event: Event) {
    const confirmed = window.confirm(`Delete "${event.name}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(event.id);
    try {
      const { error } = await supabase.from('events').delete().eq('id', event.id);
      if (error) throw error;
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    } catch (err: any) {
      console.error('Error deleting event:', err.message);
      window.alert('Failed to delete event.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-20 md:pt-24 stagger-rise">
      {/* Header */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pt-6 md:pt-10 pb-4 grid grid-cols-[1fr_auto_1fr] items-center shrink-0">
        <span aria-hidden />
        <h1 className="font-bold text-2xl md:text-4xl text-white tracking-wide text-center">Events</h1>
        <div className="flex justify-end">
          {isAdmin && (
            <button
              onClick={openAddForm}
              className="flex items-center gap-1 bg-accent hover:bg-accent-hover text-white border-none rounded-full px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base cursor-pointer transition-colors"
              aria-label="Add event"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 shrink-0">
        <div className="bg-accent/20 rounded-xl px-5 py-4 md:px-7 md:py-6 mb-5 md:mb-8">
          <p className="text-white text-sm md:text-base leading-relaxed m-0">
            Join us for worship, fellowship, and community. Browse upcoming events from Deep Calls To Deep Ministries below.
          </p>
        </div>
      </div>
 

      {/* Scrollable content */}
      <div className="w-full max-w-md md:max-w-6xl px-6 md:px-10 lg:px-16 pb-28">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-400 text-center text-sm py-16">
            No upcoming events scheduled. Check back soon!
          </p>
        ) : (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 md:items-start">
            {events.map((event) => (
              <div key={event.id} className="bg-slate-800 rounded-xl overflow-hidden">
                {/* Event header */}
                <div className="bg-accent px-5 md:px-6 py-4 md:py-5 flex items-center gap-2">
                  <h3 className="text-white font-bold text-lg md:text-xl m-0 flex-1">{event.name}</h3>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => openEditForm(event)}
                        className="text-white bg-transparent border border-white/40 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-white/10"
                        aria-label={`Edit ${event.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        disabled={deletingId === event.id}
                        className="text-white bg-transparent border border-red-400/60 rounded-md px-2 py-1 text-xs cursor-pointer hover:bg-red-500/20 disabled:opacity-50"
                        aria-label={`Delete ${event.name}`}
                      >
                        {deletingId === event.id ? '...' : 'Delete'}
                      </button>
                    </>
                  )}
                </div>

                <div className="px-5 md:px-6 py-4 md:py-5 flex flex-col gap-3">
                  {/* Date & time */}
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <CalendarIcon />
                    <span>
                      {formatDate(event.event_date)}
                      {event.event_time && ` at ${formatTime(event.event_time)}`}
                    </span>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-3 text-gray-300 text-sm">
                      <PinIcon />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {/* Description */}
                  {event.description && (
                    <p className="text-gray-300 text-sm leading-relaxed m-0 mt-1">
                      {event.description}
                    </p>
                  )}

                  {/* Contact info */}
                  {(event.contact_name || event.contact_email || event.contact_phone) && (
                    <div className="bg-slate-900 rounded-xl p-4 mt-1 flex flex-col gap-2">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Contact</span>
                      {event.contact_name && (
                        <div className="flex items-center gap-3 text-white text-sm">
                          <PersonIcon />
                          <span>{event.contact_name}</span>
                        </div>
                      )}
                      {event.contact_email && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-white"><EmailIcon /></span>
                          <a href={`mailto:${event.contact_email}`} className="text-blue-400 no-underline hover:underline">
                            {event.contact_email}
                          </a>
                        </div>
                      )}
                      {event.contact_phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-white"><PhoneIcon /></span>
                          <a href={`tel:${event.contact_phone}`} className="text-blue-400 no-underline hover:underline">
                            {event.contact_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <EventFormModal
          event={editingEvent}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            setLoading(true);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
