import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// 1. Define the shape of your Event object
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
  created_at?: string;
}

function EventSchedule() {
  // 2. Add the Type to your state: an array of Events
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents(): Promise<void> {
    try {
      setLoading(true);
      
      // Supabase is smart enough to infer types if you use their generated types, 
      // but manual typing like this works perfectly for most projects.
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      
      // 3. Ensure data is cast to our Event interface
      setEvents((data as Event[]) || []);
    } catch (error: any) {
      console.error('Error fetching events:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading events...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "white" }}>Upcoming Events</h2>
      <hr />

      {events.length === 0 ? (
        <p style={{ color: "white" }}>No upcoming events scheduled.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              borderBottom: "1px solid #444",
              padding: "20px 0",
            }}
          >
            <h3 style={{ margin: "0 0 5px 0", color: "white" }}>
              {event.name}
            </h3>

            <p style={{ margin: "0 0 8px 0", color: "#ccc" }}>
              {event.description}
            </p>

            <p style={{ margin: "0 0 6px 0", color: "white" }}>
              📍 {event.location}
            </p>

            <small style={{ display: "block", fontWeight: "bold", color: "#007bff", marginBottom: "10px" }}>
              🕒 {event.event_time} — {event.event_date}
            </small>

            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "14px",
                color: "black"
              }}
            >
              <strong>Contact:</strong>
              <div>👤 {event.contact_name}</div>
              <div>📧 {event.contact_email}</div>
              <div>📞 {event.contact_phone}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EventSchedule;