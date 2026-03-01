import { useState } from 'react';
import { db } from '../db/database';
import { usePets, useReminders } from '../hooks/usePets';
import { useSetting } from '../hooks/useSetting';
import { getSpeciesEmoji } from '../utils/helpers';
import { useToast } from '../components/Toast';
import { isBefore, isToday, format } from 'date-fns';
import BottomSheet from '../components/BottomSheet';

const REMINDER_TYPES = ['medication', 'vet_appointment', 'vaccination', 'grooming', 'feeding', 'custom'];
const REMINDER_EMOJIS = { medication: '💊', vet_appointment: '🏥', vaccination: '💉', grooming: '✂️', feeding: '🍕', custom: '📝' };

export default function Reminders() {
  const reminders = useReminders();
  const pets = usePets();
  const toast = useToast();
  const [premium] = useSetting('premium');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ petId: '', type: 'medication', title: '', dateTime: '', repeat: 'none', notes: '' });

  const getPet = (id) => pets.find((p) => p.id === id);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const overdue = reminders.filter((r) => !r.completed && isBefore(new Date(r.dateTime), new Date()) && !isToday(new Date(r.dateTime)));
  const today = reminders.filter((r) => !r.completed && isToday(new Date(r.dateTime)));
  const upcoming = reminders.filter((r) => !r.completed && !isBefore(new Date(r.dateTime), new Date()) && !isToday(new Date(r.dateTime)));

  const complete = async (rem) => {
    await db.reminders.update(rem.id, { completed: true, completedAt: new Date().toISOString() });
    await db.activities.add({
      petId: rem.petId,
      type: rem.type === 'vet_appointment' ? 'vet_visit' : rem.type,
      timestamp: new Date().toISOString(),
      notes: rem.title,
      createdAt: new Date().toISOString(),
    });
    toast(`${rem.title} completed`, '✅');
  };

  const snooze = async (rem) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    await db.reminders.update(rem.id, { dateTime: tomorrow.toISOString(), snoozedUntil: tomorrow.toISOString() });
    toast('Snoozed until tomorrow', '⏰');
  };

  const addReminder = async () => {
    if (!form.petId || !form.dateTime) return;
    if (form.repeat !== 'none' && !premium) {
      toast('Auto-repeat is a Premium feature', '🔒');
      return;
    }
    await db.reminders.add({
      petId: Number(form.petId),
      type: form.type,
      title: form.title || form.type.replace('_', ' '),
      dateTime: new Date(form.dateTime).toISOString(),
      repeat: form.repeat,
      notes: form.notes.trim() || null,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    toast('Reminder added', '🔔');
    setShowAdd(false);
    setForm({ petId: '', type: 'medication', title: '', dateTime: '', repeat: 'none', notes: '' });
  };

  const renderCard = (rem, cls) => {
    const pet = getPet(rem.petId);
    return (
      <div key={rem.id} className={`reminder-card ${cls}`} role="article" aria-label={`${rem.title} for ${pet?.name || 'Unknown'}`}>
        <div style={{ fontSize: 24 }}>{REMINDER_EMOJIS[rem.type] || '📝'}</div>
        <div className="reminder-info">
          <div className="reminder-pet">{pet?.name || 'Unknown'} — {rem.title}</div>
          <div className="reminder-due">{format(new Date(rem.dateTime), 'MMM d, h:mm a')}</div>
        </div>
        <div className="reminder-actions">
          <button className="btn-done" onClick={() => complete(rem)} aria-label={`Complete ${rem.title}`}>Done</button>
          <button className="btn-snooze" onClick={() => snooze(rem)} aria-label={`Snooze ${rem.title}`}>Snooze</button>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Reminders</h1>
        <button className="quick-chip" onClick={() => setShowAdd(true)} aria-label="Add reminder">+ Add</button>
      </div>

      {reminders.filter((r) => !r.completed).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">🔔</div>
          <h3>No reminders</h3>
          <p>Add reminders for medications, vet appointments, and more.</p>
        </div>
      )}

      {overdue.length > 0 && (
        <>
          <div className="timeline-group-label" style={{ color: 'var(--error)' }}>⚠️ OVERDUE ({overdue.length})</div>
          {overdue.map((r) => renderCard(r, 'overdue'))}
        </>
      )}

      {today.length > 0 && (
        <>
          <div className="timeline-group-label">📅 TODAY ({today.length})</div>
          {today.map((r) => renderCard(r, 'today'))}
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <div className="timeline-group-label">📆 UPCOMING</div>
          {upcoming.map((r) => renderCard(r, ''))}
        </>
      )}

      <BottomSheet open={showAdd} onClose={() => setShowAdd(false)} title="Add Reminder">
        <div className="form-group">
          <label className="form-label" htmlFor="rem-pet">Pet *</label>
          <select id="rem-pet" className="form-input" value={form.petId} onChange={(e) => set('petId', e.target.value)} aria-required="true">
            <option value="">Select pet</option>
            {pets.map((p) => <option key={p.id} value={p.id}>{getSpeciesEmoji(p.species)} {p.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="rem-type">Type</label>
          <select id="rem-type" className="form-input" value={form.type} onChange={(e) => set('type', e.target.value)}>
            {REMINDER_TYPES.map((t) => <option key={t} value={t}>{REMINDER_EMOJIS[t]} {t.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="rem-title">Title</label>
          <input id="rem-title" className="form-input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g., Heartworm pill" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="rem-dt">Date & Time *</label>
          <input id="rem-dt" className="form-input" type="datetime-local" value={form.dateTime} onChange={(e) => set('dateTime', e.target.value)} aria-required="true" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="rem-repeat">Repeat</label>
          <select id="rem-repeat" className="form-input" value={form.repeat} onChange={(e) => set('repeat', e.target.value)}>
            <option value="none">None</option>
            <option value="daily">Daily {!premium ? '🔒' : ''}</option>
            <option value="weekly">Weekly {!premium ? '🔒' : ''}</option>
            <option value="monthly">Monthly {!premium ? '🔒' : ''}</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="rem-notes">Notes</label>
          <textarea id="rem-notes" className="form-textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Optional notes" />
        </div>
        <button className="btn btn-primary btn-block" onClick={addReminder} disabled={!form.petId || !form.dateTime} aria-label="Save reminder">
          Save Reminder
        </button>
      </BottomSheet>
    </div>
  );
}
