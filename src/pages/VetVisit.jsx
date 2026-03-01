import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../db/database';
import { usePet } from '../hooks/usePets';
import { VET_REASONS, VACCINATION_PRESETS } from '../utils/helpers';
import { useToast } from '../components/Toast';

export default function VetVisit() {
  const { petId } = useParams();
  const pet = usePet(petId);
  const nav = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    clinicName: '', vetName: '', reason: 'checkup',
    vaccinations: [], weightValue: '', diagnosis: '',
    prescriptions: [], followUpDate: '', notes: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleVax = (vax) => {
    setForm((f) => ({
      ...f,
      vaccinations: f.vaccinations.includes(vax)
        ? f.vaccinations.filter((v) => v !== vax)
        : [...f.vaccinations, vax],
    }));
  };

  const save = async () => {
    const visit = {
      petId: Number(petId),
      date: form.date,
      clinicName: form.clinicName.trim() || null,
      vetName: form.vetName.trim() || null,
      reason: form.reason,
      vaccinations: form.vaccinations.length ? form.vaccinations : null,
      weightAtVisit: form.weightValue ? { value: parseFloat(form.weightValue), unit: 'lbs' } : null,
      diagnosis: form.diagnosis.trim() || null,
      prescriptions: form.prescriptions.length ? form.prescriptions : null,
      followUpDate: form.followUpDate || null,
      notes: form.notes.trim() || null,
      documents: null,
      createdAt: new Date().toISOString(),
    };
    const visitId = await db.vetVisits.add(visit);
    await db.activities.add({
      petId: Number(petId),
      type: 'vet_visit',
      timestamp: new Date(form.date).toISOString(),
      vetVisitId: visitId,
      notes: `${form.reason}${form.clinicName ? ` at ${form.clinicName}` : ''}`,
      createdAt: new Date().toISOString(),
    });
    toast('Vet visit logged', '🏥');
    nav(-1);
  };

  const vaxPresets = pet ? (VACCINATION_PRESETS[pet.species] || []) : [];

  return (
    <div className="page">
      <div className="page-header">
        <button className="back-btn" onClick={() => nav(-1)} aria-label="Go back">← Back</button>
        <h1 className="page-title" style={{ fontSize: 22 }}>Vet Visit</h1>
        <div style={{ width: 60 }} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="vv-date">Date *</label>
        <input id="vv-date" className="form-input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} aria-required="true" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="vv-clinic">Clinic Name</label>
        <input id="vv-clinic" className="form-input" value={form.clinicName} onChange={(e) => set('clinicName', e.target.value)} placeholder="e.g., Happy Paws Vet" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="vv-vet">Vet Name</label>
        <input id="vv-vet" className="form-input" value={form.vetName} onChange={(e) => set('vetName', e.target.value)} placeholder="e.g., Dr. Smith" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="vv-reason">Reason *</label>
        <select id="vv-reason" className="form-input" value={form.reason} onChange={(e) => set('reason', e.target.value)} aria-required="true">
          {VET_REASONS.map((r) => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>
      </div>

      {vaxPresets.length > 0 && (
        <div className="form-group">
          <label className="form-label">Vaccinations</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {vaxPresets.map((v) => (
              <button
                key={v}
                className="quick-chip"
                style={form.vaccinations.includes(v) ? { background: 'rgba(74,155,142,0.15)', border: '2px solid var(--brand-secondary)' } : {}}
                onClick={() => toggleVax(v)}
                aria-pressed={form.vaccinations.includes(v)}
                aria-label={`Toggle ${v} vaccination`}
              >
                💉 {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="vv-weight">Weight at Visit</label>
        <input id="vv-weight" className="form-input" type="number" value={form.weightValue} onChange={(e) => set('weightValue', e.target.value)} placeholder="0" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="vv-diagnosis">Diagnosis</label>
        <textarea id="vv-diagnosis" className="form-textarea" value={form.diagnosis} onChange={(e) => set('diagnosis', e.target.value)} placeholder="Optional diagnosis notes" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="vv-followup">Follow-up Date</label>
        <input id="vv-followup" className="form-input" type="date" value={form.followUpDate} onChange={(e) => set('followUpDate', e.target.value)} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="vv-notes">Notes</label>
        <textarea id="vv-notes" className="form-textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Additional notes..." />
      </div>

      <button className="btn btn-primary btn-block" onClick={save} aria-label="Save vet visit">
        Save Vet Visit
      </button>
    </div>
  );
}
