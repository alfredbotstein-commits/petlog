import { useAllActivities, usePets } from '../hooks/usePets';
import { getActivityEmoji, groupByDate } from '../utils/helpers';
import { format } from 'date-fns';

export default function Timeline() {
  const activities = useAllActivities();
  const pets = usePets();

  const getPetName = (petId) => pets.find((p) => p.id === petId)?.name || 'Unknown';
  const grouped = groupByDate(activities);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Timeline</h1>
      </div>
      {activities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">📋</div>
          <h3>No activities yet</h3>
          <p>Activities you log will appear here across all your pets.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="timeline-group-label">{date}</div>
            {items.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-icon" aria-hidden="true">{getActivityEmoji(item.type)}</div>
                <div className="timeline-content">
                  <div className="timeline-type">
                    {getPetName(item.petId)} — {item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ')}
                  </div>
                  <div className="timeline-time">{format(new Date(item.timestamp), 'h:mm a')}</div>
                  {item.notes && <div className="timeline-note">{item.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
