import { useSetting } from '../hooks/useSetting';
import { PREMIUM_FEATURES, setPremium } from '../utils/premium';

export function PremiumBanner() {
  const [premium] = useSetting('premium');
  if (premium) return null;
  return (
    <div className="premium-banner" role="complementary" aria-label="Premium upgrade offer">
      <h4>🐾 Unlock PetLog Premium</h4>
      <p>Unlimited pets, PDF export, medication reminders & more — $2.99 one-time</p>
      <button
        className="btn"
        style={{ background: 'white', color: '#E8764B', marginTop: 10 }}
        onClick={() => setPremium(true)}
        aria-label="Upgrade to PetLog Premium for $2.99"
      >
        Upgrade — $2.99
      </button>
    </div>
  );
}

export function PremiumSheet({ onClose }) {
  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>🐾</div>
      <h3 style={{ textAlign: 'center', marginBottom: 8 }}>PetLog Premium</h3>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 16 }}>
        One-time purchase. No subscriptions.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20 }}>
        {PREMIUM_FEATURES.map((f) => (
          <li key={f} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <span>✅</span> {f}
          </li>
        ))}
      </ul>
      <button
        className="btn btn-primary btn-block"
        onClick={() => { setPremium(true); onClose(); }}
        aria-label="Purchase PetLog Premium for $2.99"
      >
        Unlock Premium — $2.99
      </button>
      <button
        className="btn btn-secondary btn-block"
        style={{ marginTop: 8 }}
        onClick={onClose}
        aria-label="Close premium offer"
      >
        Not Now
      </button>
    </div>
  );
}
