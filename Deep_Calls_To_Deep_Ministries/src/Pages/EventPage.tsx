import EventSchedule from '../Components/EventSchedule';

type EventPageProps = {
  onBack?: () => void;
};

function EventPage({ onBack }: EventPageProps) {
  return (
    <div>
      {/* Optional Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            margin: '20px',
            padding: '8px 16px',
            borderRadius: '4px',
            backgroundColor: '#ffdd00',
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          Back
        </button>
      )}
      <EventSchedule />
    </div>
  );
}

export default EventPage;