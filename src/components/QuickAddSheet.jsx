import { useState } from 'react';
import { db } from '../db/database';
import { usePets } from '../hooks/usePets';
import { ACTIVITY_TYPES, getSpeciesEmoji } from '../utils/helpers';
import { useToast } from './Toast';

export default function QuickAddSheet({ onClose }) {
  const pets = usePets();
  const toast = useToast();
  const [selectedPet, setSelectedPet] = useState(pets.length === 1 ? pets[0]?.id : null);

  const logActivity = async (type) => {
    if (!selectedPet) return;
    const pet = pets.find((p) => p.id === selectedPet);
    await db.activities.add({
      petId: selectedPet,
      type: type.value,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    toast(`${type.emoji} ${type.label} logged for ${pet?.name}`, type.emoji);
    onClose();
  };

  return (
    <div>
      <p style={{ fontWeight: 500, marginBottom: 10, color: 'var(--text-secondary)' }}>Which pet?</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {pets.map((pet) => (
          <button
            key={pet.id}
            className="quick-chip"
            style={selectedPet === pet.id ? { background: 'rgba(232,118,75,0.15)', border: '2px solid var(--brand-primary)' } : {}}
            onClick={() => setSelectedPet(pet.id)}
            aria-label={`Select ${pet.name}`}
            aria-pressed={selectedPet === pet.id}
          >
            {getSpeciesEmoji(pet.species)} {pet.name}
          </button>
        ))}
      </div>
      <p style={{ fontWeight: 500, marginBottom: 10, color: 'var(--text-secondary)' }}>What happened?</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {ACTIVITY_TYPES.map((a) => (
          <button
            key={a.value}
            className="quick-chip"
            onClick={() => logActivity(a)}
            disabled={!selectedPet}
            aria-label={`Log ${a.label}`}
          >
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <button
        className="btn btn-secondary btn-block"
        style={{ marginTop: 20 }}
        onClick={onClose}
        aria-label="Cancel quick add"
      >
        Cancel
      </button>
    </div>
  );
}
