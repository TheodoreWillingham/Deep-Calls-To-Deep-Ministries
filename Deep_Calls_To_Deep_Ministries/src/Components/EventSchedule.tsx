// Dummy Events Will later replace with SupaBase data

const events = [
  {
    id: 1,
    name: "Tech Networking Brunch",
    description: "Connect with local developers and designers over coffee.",
    location: "1030 Darlington Dr, Watkinsville GA",
    time: "10:00 AM",
    date: "2024-07-13",
    contactName: "Sarah Johnson",
    contactEmail: "sarah@email.com",
    contactPhone: "(706) 555-1234",
  },
  {
    id: 2,
    name: "React Workshop",
    description: "Deep dive into hooks and state management.",
    location: "Living Hope, Athens GA",
    time: "1:30 PM",
    date: "2024-07-14",
    contactName: "David Lee",
    contactEmail: "david@email.com",
    contactPhone: "(706) 555-5678",
  },
  {
    id: 3,
    name: "Test",
    description: "Deep dive into hooks and test.",
    location: "5 Points Church, Athens GA",
    time: "7:50 PM",
    date: "2024-07-15",
    contactName: "Emily Carter",
    contactEmail: "emily@email.com",
    contactPhone: "(706) 555-9012",
  },
];

function EventSchedule() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Upcoming Events</h2>
      <hr />

      {events.map((event) => (
        <div
          key={event.id}
          style={{
            borderBottom: "1px solid white",
            padding: "20px 0",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0", color: "white" }}>
            {event.name}
          </h3>

          <p style={{ margin: "0 0 8px 0", color: "white" }}>
            {event.description}
          </p>

          <p style={{ margin: "0 0 6px 0", color: "white" }}>
            📍 {event.location}
          </p>

          <small style={{ display: "block", fontWeight: "bold", color: "#007bff", marginBottom: "10px" }}>
            🕒 {event.time} — {event.date}
          </small>

          {/* Contact Section */}
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
            <div>👤 {event.contactName}</div>
            <div>📧 {event.contactEmail}</div>
            <div>📞 {event.contactPhone}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventSchedule;