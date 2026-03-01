import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../db/database';
import { usePet } from '../hooks/usePets';
import { useSetting } from '../hooks/useSetting';
import { SPECIES, getSpeciesEmoji } from '../utils/helpers';
import { canAddPet } from '../utils/premium';
import { PremiumBanner } from '../components/PremiumGate';
import { useToast } from '../components/Toast';

export default function AddPet() {
  const nav = useNavigate();
  const { id } = useParams();
  const existing = usePet(id);
  const toast = useToast();
  const [premium] = useSetting('premium');

  const [form, setForm] = useState({
    name: '', species: '', breed: '', birthday: '',
    sex: 'unknown', weightValue: '', weightUnit: 'lbs',
    color: '', microchipId: '', notes: '', photoUri: '',
  });
  const [loaded, setLoaded] = useState(false);

  // Load existing data for edit
  if (existing && !loaded) {
    setForm({
      name: existing.name || '',
      species: existing.species || '',
      breed: existing.breed || '',
      birthday: existing.birthday ? existing.birthday.slice(0, 10) : '',
      sex: existing.sex || 'unknown',
      weightValue: existing.weight?.value?.toString() || '',
      weightUnit: existing.weight?.unit || 'lbs',
      color: existing.color || '',
      microchipId: existing.microchipId || '',
      notes: existing.notes || '',
      photoUri: existing.photoUri || '',
    });
    setLoaded(true);
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name.trim() && form.species;

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('photoUri', reader.result);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (!valid) return;
    if (!id) {
      const allowed = await canAddPet();
      if (!allowed) {
        toast('Upgrade to Premium for unlimited pets', '🔒');
        return;
      }
    }
    const data = {
      name: form.name.trim(),
      species: form.species,
      breed: form.breed.trim() || null,
      birthday: form.birthday || null,
      sex: form.sex,
      weight: form.weightValue ? { value: parseFloat(form.weightValue), unit: form.weightUnit } : null,
      color: form.color.trim() || null,
      microchipId: form.microchipId.trim() || null,
      notes: form.notes.trim() || null,
      photoUri: form.photoUri || null,
      updatedAt: new Date().toISOString(),
    };
    if (id) {
      await db.pets.update(Number(id), data);
      toast(`${data.name} updated`, '✅');
    } else {
      data.createdAt = new Date().toISOString();
      await db.pets.add(data);
      toast(`${data.name} added!`, '🎉');
    }
    nav(-1);
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => nav(-1)} aria-label="Go back">← Back</button>
        <h1 className="page-title" style={{ fontSize: 22 }}>{id ? 'Edit Pet' : 'Add Pet'}</h1>
        <div style={{ width: 60 }} />
      </div>

      {/* Photo */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <label htmlFor="pet-photo" style={{ cursor: 'pointer' }}>
          <div className="pet-hero-photo">
            {form.photoUri ? (
              <img src={form.photoUri} alt="Pet photo preview" />
            ) : (
              form.species ? getSpeciesEmoji(form.species) : '📷'
            )}
          </div>
          <span style={{ fontSize: 14, color: 'var(--brand-primary)' }}>
            {form.photoUri ? 'Change Photo' : 'Add Photo'}
          </span>
        </label>
        <input id="pet-photo" type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} aria-label="Upload pet photo" />
      </div>

      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="pet-name">Name *</label>
        <input id="pet-name" className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={30} placeholder="Your pet's name" aria-required="true" />
      </div>

      {/* Species */}
      <div className="form-group">
        <label className="form-label">Species *</label>
        <div className="species-picker" role="radiogroup" aria-label="Select pet species">
          {SPECIES.map((s) => (
            <button
              key={s.value}
              className={`species-option ${form.species === s.value ? 'selected' : ''}`}
              onClick={() => set('species', s.value)}
              role="radio"
              aria-checked={form.species === s.value}
              aria-label={s.label}
            >
              <span className="species-emoji">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Breed */}
      <div className="form-group">
        <label className="form-label" htmlFor="pet-breed">Breed</label>
        <input id="pet-breed" className="form-input" value={form.breed} onChange={(e) => set('breed', e.target.value)} placeholder="e.g., Golden Retriever" />
      </div>

      {/* Birthday */}
      <div className="form-group">
        <label className="form-label" htmlFor="pet-birthday">Birthday</label>
        <input id="pet-birthday" className="form-input" type="date" value={form.birthday} onChange={(e) => set('birthday', e.target.value)} />
      </div>

      {/* Sex */}
      <div className="form-group">
        <label className="form-label">Sex</label>
        <div className="segmented">
          {['male', 'female', 'unknown'].map((s) => (
            <button key={s} className={`seg-btn ${form.sex === s ? 'active' : ''}`} onClick={() => set('sex', s)} aria-label={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div className="form-group">
        <label className="form-label" htmlFor="pet-weight">Weight</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input id="pet-weight" className="form-input" type="number" value={form.weightValue} onChange={(e) => set('weightValue', e.target.value)} placeholder="0" style={{ flex: 1 }} />
          <div className="segmented" style={{ width: 120, marginBottom: 0 }}>
            <button className={`seg-btn ${form.weightUnit === 'lbs' ? 'active' : ''}`} onClick={() => set('weightUnit', 'lbs')}>lbs</button>
            <button className={`seg-btn ${form.weightUnit === 'kg' ? 'active' : ''}`} onClick={() => set('weightUnit', 'kg')}>kg</button>
          </div>
        </div>
      </div>

      {/* Color */}
      <div className="form-group">
        <label className="form-label" htmlFor="pet-color">Color/Markings</label>
        <input id="pet-color" className="form-input" value={form.color} onChange={(e) => set('color', e.target.value)} placeholder="e.g., Golden" />
      </div>

      {/* Microchip */}
      <div className="form-group">
        <label className="form-label" htmlFor="pet-chip">Microchip #</label>
        <input id="pet-chip" className="form-input" value={form.microchipId} onChange={(e) => set('microchipId', e.target.value)} placeholder="Optional" />
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label" htmlFor="pet-notes">Notes</label>
        <textarea id="pet-notes" className="form-textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Allergies, special needs..." />
      </div>

      <button className="btn btn-primary btn-block" onClick={save} disabled={!valid} aria-label={id ? 'Save changes' : 'Add pet'}>
        {id ? 'Save Changes' : 'Add Pet'}
      </button>
    </div>
  );
}
