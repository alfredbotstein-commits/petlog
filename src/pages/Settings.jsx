import { useState } from 'react';
import { useSetting } from '../hooks/useSetting';
import { db } from '../db/database';
import { useToast } from '../components/Toast';
import BottomSheet from '../components/BottomSheet';
import { PremiumSheet } from '../components/PremiumGate';

export default function Settings() {
  const [units, setUnits] = useSetting('units');
  const [dateFormat, setDateFormat] = useSetting('dateFormat');
  const [defaultView, setDefaultView] = useSetting('defaultView');
  const [theme, setTheme] = useSetting('theme');
  const [premium] = useSetting('premium');
  const toast = useToast();
  const [showPremium, setShowPremium] = useState(false);

  const exportData = async () => {
    const data = {
      pets: await db.pets.toArray(),
      activities: await db.activities.toArray(),
      vetVisits: await db.vetVisits.toArray(),
      reminders: await db.reminders.toArray(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petlog-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported', '📦');
  };

  const importData = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.pets) { await db.pets.clear(); await db.pets.bulkAdd(data.pets); }
        if (data.activities) { await db.activities.clear(); await db.activities.bulkAdd(data.activities); }
        if (data.vetVisits) { await db.vetVisits.clear(); await db.vetVisits.bulkAdd(data.vetVisits); }
        if (data.reminders) { await db.reminders.clear(); await db.reminders.bulkAdd(data.reminders); }
        toast('Data imported successfully', '✅');
      } catch {
        toast('Import failed — invalid file', '❌');
      }
    };
    input.click();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      {/* Account */}
      <div className="settings-section">
        <div className="settings-section-title">Account</div>
        <div className="settings-row" onClick={() => setShowPremium(true)} role="button" tabIndex={0} aria-label="Manage premium subscription">
          <span className="settings-row-label">Premium</span>
          <span className="settings-row-value">{premium ? '✅ Active' : 'Upgrade →'}</span>
        </div>
      </div>

      {/* Preferences */}
      <div className="settings-section">
        <div className="settings-section-title">Preferences</div>
        <div className="settings-row">
          <span className="settings-row-label">Units</span>
          <select className="form-input" style={{ width: 'auto', height: 36, fontSize: 14 }} value={units || 'lbs'} onChange={(e) => setUnits(e.target.value)} aria-label="Weight units">
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Date Format</span>
          <select className="form-input" style={{ width: 'auto', height: 36, fontSize: 14 }} value={dateFormat || 'MM/dd/yyyy'} onChange={(e) => setDateFormat(e.target.value)} aria-label="Date format">
            <option value="MM/dd/yyyy">MM/DD/YYYY</option>
            <option value="dd/MM/yyyy">DD/MM/YYYY</option>
            <option value="yyyy-MM-dd">YYYY-MM-DD</option>
          </select>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Default View</span>
          <select className="form-input" style={{ width: 'auto', height: 36, fontSize: 14 }} value={defaultView || 'grid'} onChange={(e) => setDefaultView(e.target.value)} aria-label="Default pet view">
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
        <div className="settings-row">
          <span className="settings-row-label">Theme</span>
          <select className="form-input" style={{ width: 'auto', height: 36, fontSize: 14 }} value={theme || 'system'} onChange={(e) => setTheme(e.target.value)} aria-label="App theme">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      {/* Data */}
      <div className="settings-section">
        <div className="settings-section-title">Data</div>
        {premium && (
          <div className="settings-row" role="button" tabIndex={0} aria-label="Export vet records as PDF">
            <span className="settings-row-label">Export Vet Records (PDF)</span>
            <span className="settings-row-value premium-badge">🔒 Coming Soon</span>
          </div>
        )}
        <div className="settings-row" onClick={exportData} role="button" tabIndex={0} aria-label="Export all data as JSON">
          <span className="settings-row-label">Export All Data (JSON)</span>
          <span className="settings-row-value">→</span>
        </div>
        <div className="settings-row" onClick={importData} role="button" tabIndex={0} aria-label="Import data from JSON file">
          <span className="settings-row-label">Import Data</span>
          <span className="settings-row-value">→</span>
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <div className="settings-section-title">About</div>
        <div className="settings-row">
          <span className="settings-row-label">Version</span>
          <span className="settings-row-value">1.0.0</span>
        </div>
        <div className="settings-row" role="button" tabIndex={0} aria-label="View privacy policy">
          <span className="settings-row-label">Privacy Policy</span>
          <span className="settings-row-value">→</span>
        </div>
      </div>

      <BottomSheet open={showPremium} onClose={() => setShowPremium(false)} title="Premium">
        <PremiumSheet onClose={() => setShowPremium(false)} />
      </BottomSheet>
    </div>
  );
}
