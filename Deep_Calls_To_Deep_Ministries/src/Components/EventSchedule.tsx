// Dummy Events Will later replace with SupaBase data

const events = [
  {
    id: 1,
    name: "Tech Networking Brunch",
    description: "Connect with local developers and designers over coffee.",
    time: "10:00 AM",
    date: "2024-07-13",
  },
  {
    id: 2,
    name: "React Workshop",
    description: "Deep dive into hooks and state management.",
    time: "1:30 PM",
    date: "2024-07-14",
  },
  {
    id: 3,
    name: "Test",
    description: "Deep dive into hooks and test.",
    time: "7:50 PM",
    date: "2024-07-15",
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
            borderBottom: "1px solid #eee",
            padding: "15px 0",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>{event.name}</h3>
          <p style={{ margin: "0 0 10px 0", color: "#666" }}>
            {event.description}
          </p>
          <small style={{ fontWeight: "bold", color: "#007bff" }}>
            🕒 {event.time} - {event.date}
          </small>
        </div>
      ))}
    </div>
  );
}

export default EventSchedule;
