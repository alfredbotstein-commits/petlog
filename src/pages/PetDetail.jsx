import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../db/database';
import { usePet, useActivities } from '../hooks/usePets';
import { useSetting } from '../hooks/useSetting';
import { petAge, getSpeciesEmoji, getActivityEmoji, groupByDate, ACTIVITY_TYPES } from '../utils/helpers';
import { useToast } from '../components/Toast';
import { format } from 'date-fns';

export default function PetDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const pet = usePet(id);
  const activities = useActivities(id);
  const toast = useToast();
  const [tab, setTab] = useState('timeline');
  const [premium] = useSetting('premium');
  const [showDelete, setShowDelete] = useState(false);

  if (!pet) return <div className="page"><p>Loading...</p></div>;

  const quickLog = async (type) => {
    await db.activities.add({
      petId: pet.id,
      type: type.value,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    toast(`${type.emoji} ${type.label} logged`, type.emoji);
  };

  const deletePet = async () => {
    await db.activities.where('petId').equals(pet.id).delete();
    await db.vetVisits.where('petId').equals(pet.id).delete();
    await db.reminders.where('petId').equals(pet.id).delete();
    await db.pets.delete(pet.id);
    toast(`${pet.name} removed`, '🗑️');
    nav('/');
  };

  const grouped = groupByDate(activities);
  const healthActivities = activities.filter((a) =>
    ['vet_visit', 'vaccination', 'medication', 'weighed'].includes(a.type)
  );
  const healthGrouped = groupByDate(healthActivities);
  const photoActivities = activities.filter((a) => a.type === 'photo' && a.photoUri);

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => nav('/')} aria-label="Go back to My Pets">← Back</button>
        <button className="back-btn" onClick={() => nav(`/edit-pet/${pet.id}`)} aria-label={`Edit ${pet.name}`}>✏️ Edit</button>
      </div>

      {/* Hero */}
      <div className="pet-hero">
        <div className="pet-hero-photo">
          {pet.photoUri ? <img src={pet.photoUri} alt={`${pet.name}, ${pet.species}`} /> : getSpeciesEmoji(pet.species)}
        </div>
        <div className="pet-hero-name">{pet.name}</div>
        <div className="pet-hero-breed">
          {pet.breed ? `${pet.breed} · ` : ''}{pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : ''}
        </div>
        <div className="pet-hero-stats">
          {pet.birthday && <span className="pet-stat">{petAge(pet.birthday)}</span>}
          {pet.weight && <span className="pet-stat">{pet.weight.value} {pet.weight.unit}</span>}
          {pet.sex && pet.sex !== 'unknown' && <span className="pet-stat">{pet.sex.charAt(0).toUpperCase() + pet.sex.slice(1)}</span>}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 20 }}>
        <div className="quick-actions" role="toolbar" aria-label="Quick actions">
          {ACTIVITY_TYPES.slice(0, 6).map((a) => (
            <button key={a.value} className="quick-chip" onClick={() => quickLog(a)} aria-label={`Log ${a.label} for ${pet.name}`}>
              {a.emoji} {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="segmented">
        <button className={`seg-btn ${tab === 'timeline' ? 'active' : ''}`} onClick={() => setTab('timeline')}>Timeline</button>
        <button className={`seg-btn ${tab === 'health' ? 'active' : ''}`} onClick={() => setTab('health')}>Health</button>
        <button className={`seg-btn ${tab === 'photos' ? 'active' : ''}`} onClick={() => setTab('photos')}>
          Photos {!premium && <span className="premium-badge">🔒</span>}
        </button>
      </div>

      {/* Timeline */}
      {tab === 'timeline' && (
        <div>
          {activities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">📝</div>
              <h3>No activities yet</h3>
              <p>Use the quick actions above to start logging care.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <div className="timeline-group-label">{date}</div>
                {items.map((item) => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-icon" aria-hidden="true">{getActivityEmoji(item.type)}</div>
                    <div className="timeline-content">
                      <div className="timeline-type">{item.type.charAt(0).toUpperCase() + item.type.slice(1).replace('_', ' ')}</div>
                      <div className="timeline-time">{format(new Date(item.timestamp), 'h:mm a')}</div>
                      {item.notes && <div className="timeline-note">{item.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'health' && (
        <div>
          <button className="btn btn-secondary btn-block" style={{ marginBottom: 16 }} onClick={() => nav(`/vet-visit/${pet.id}`)} aria-label="Add vet visit">
            🏥 Add Vet Visit
          </button>
          {healthActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">🏥</div>
              <h3>No health records</h3>
              <p>Log vet visits, medications, and weight to track health.</p>
            </div>
          ) : (
            Object.entries(healthGrouped).map(([date, items]) => (
              <div key={date}>
                <div className="timeline-group-label">{date}</div>
                {items.map((item) => (
                  <div key={item.id} className="timeline-item">
                    <div className="timeline-icon" aria-hidden="true">{getActivityEmoji(item.type)}</div>
                    <div className="timeline-content">
                      <div className="timeline-type">{item.type.replace('_', ' ')}</div>
                      <div className="timeline-time">{format(new Date(item.timestamp), 'h:mm a')}</div>
                      {item.notes && <div className="timeline-note">{item.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'photos' && !premium && (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">📸</div>
          <h3>Photo Journal</h3>
          <p>Upgrade to Premium to unlock the photo journal.</p>
          <span className="premium-badge">🔒 Premium Feature</span>
        </div>
      )}

      {tab === 'photos' && premium && (
        <div>
          {photoActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">📸</div>
              <h3>No photos yet</h3>
              <p>Log photo activities to build your pet's journal.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              {photoActivities.map((a) => (
                <img key={a.id} src={a.photoUri} alt="Pet photo" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <button className="btn btn-destructive" onClick={() => setShowDelete(true)} aria-label={`Delete ${pet.name}`}>
          Delete {pet.name}
        </button>
      </div>

      {showDelete && (
        <div className="dialog-overlay" onClick={() => setShowDelete(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-label="Confirm delete">
            <h3>Delete {pet.name}?</h3>
            <p>This will remove all activities, vet visits, and reminders for {pet.name}. This cannot be undone.</p>
            <div className="dialog-buttons">
              <button className="btn btn-secondary" onClick={() => setShowDelete(false)} aria-label="Cancel delete">Cancel</button>
              <button className="btn btn-destructive" onClick={deletePet} aria-label="Confirm delete">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
