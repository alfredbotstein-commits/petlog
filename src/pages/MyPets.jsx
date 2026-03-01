import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../hooks/usePets';
import { useSetting } from '../hooks/useSetting';
import { petAge, getSpeciesEmoji, SPECIES_COLORS } from '../utils/helpers';
import { PremiumBanner } from '../components/PremiumGate';
import { useReminders } from '../hooks/usePets';
import { isBefore } from 'date-fns';

export default function MyPets() {
  const pets = usePets();
  const nav = useNavigate();
  const [view, setView] = useSetting('defaultView');
  const reminders = useReminders();
  const [premium] = useSetting('premium');

  const getStatus = (petId) => {
    const petReminders = reminders.filter((r) => r.petId === petId && !r.completed);
    const overdue = petReminders.filter((r) => isBefore(new Date(r.dateTime), new Date()));
    if (overdue.length > 0) return { cls: 'overdue', text: `${overdue.length} overdue` };
    if (petReminders.length > 0) return { cls: 'warn', text: `${petReminders.length} upcoming` };
    return { cls: 'ok', text: 'All up to date' };
  };

  if (pets.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">My Pets</h1>
        </div>
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">🐾</div>
          <h3>Add your first pet</h3>
          <p>Start tracking your pet&apos;s care with just a few taps.</p>
          <button className="btn btn-primary" onClick={() => nav('/add-pet')} aria-label="Add your first pet">
            Add Pet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Pets</h1>
        <button
          className="quick-chip"
          onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
          aria-label={`Switch to ${view === 'grid' ? 'list' : 'grid'} view`}
        >
          {view === 'grid' ? '☰' : '⊞'}
        </button>
      </div>

      {!premium && pets.length >= 2 && <PremiumBanner />}

      {view === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pets.map((pet) => {
            const status = getStatus(pet.id);
            return (
              <div
                key={pet.id}
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderLeft: `3px solid ${SPECIES_COLORS[pet.species] || '#9E9EA8'}` }}
                onClick={() => nav(`/pet/${pet.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`View ${pet.name}, ${pet.species}`}
                onKeyDown={(e) => e.key === 'Enter' && nav(`/pet/${pet.id}`)}
              >
                <div className="pet-avatar" style={{ width: 48, height: 48, fontSize: 24, flexShrink: 0 }}>
                  {pet.photoUri ? <img src={pet.photoUri} alt={`${pet.name}, ${pet.species}`} /> : getSpeciesEmoji(pet.species)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="pet-name" style={{ fontSize: 16 }}>{pet.name} {getSpeciesEmoji(pet.species)}</div>
                  <div className="pet-subtitle">{petAge(pet.birthday)}{pet.weight ? ` · ${pet.weight.value} ${pet.weight.unit}` : ''}</div>
                </div>
                <span className={`status-chip ${status.cls}`}>{status.text}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="pet-grid">
          {pets.map((pet) => {
            const status = getStatus(pet.id);
            return (
              <div
                key={pet.id}
                className="pet-card"
                style={{ '--accent-color': SPECIES_COLORS[pet.species] || '#9E9EA8' }}
                onClick={() => nav(`/pet/${pet.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`View ${pet.name}, ${pet.species}, ${status.text}`}
                onKeyDown={(e) => e.key === 'Enter' && nav(`/pet/${pet.id}`)}
              >
                <div className="pet-avatar">
                  {pet.photoUri ? <img src={pet.photoUri} alt={`${pet.name}, ${pet.species}`} /> : getSpeciesEmoji(pet.species)}
                </div>
                <div className="pet-name">{pet.name} {getSpeciesEmoji(pet.species)}</div>
                <div className="pet-subtitle">
                  {petAge(pet.birthday)}{pet.weight ? ` · ${pet.weight.value} ${pet.weight.unit}` : ''}
                </div>
                <span className={`status-chip ${status.cls}`}>{status.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
