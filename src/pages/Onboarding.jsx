import { useState } from 'react';
import { db } from '../db/database';

const SCREENS = [
  {
    icon: '🐾',
    title: 'Welcome to PetLog',
    desc: "All your pet's info. One tap away.",
    btn: 'Get Started',
  },
  {
    icon: '🐕',
    title: 'Add Your First Pet',
    desc: 'Track meals, walks, vet visits, and more. You can add more pets later.',
    btn: 'Continue',
  },
  {
    icon: '⚡',
    title: 'Log Care in 2 Taps',
    desc: 'Use the quick-add button to log meals, walks, and vet visits in seconds.',
    btn: 'Start Using PetLog',
  },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  const next = async () => {
    if (step < SCREENS.length - 1) {
      setStep(step + 1);
    } else {
      await db.settings.put({ key: 'onboardingComplete', value: true });
      onComplete();
    }
  };

  const skip = async () => {
    await db.settings.put({ key: 'onboardingComplete', value: true });
    onComplete();
  };

  const s = SCREENS[step];

  return (
    <div className="onboarding" role="main" aria-label="Onboarding">
      <div className="onb-icon" aria-hidden="true">{s.icon}</div>
      <h1>{s.title}</h1>
      <p>{s.desc}</p>
      <div className="onboarding-dots" aria-hidden="true">
        {SCREENS.map((_, i) => (
          <div key={i} className={`onboarding-dot ${i === step ? 'active' : ''}`} />
        ))}
      </div>
      <button className="btn btn-primary btn-block" onClick={next} aria-label={s.btn}>
        {s.btn}
      </button>
      {step < SCREENS.length - 1 && (
        <button
          style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 14 }}
          onClick={skip}
          aria-label="Skip onboarding"
        >
          Skip
        </button>
      )}
    </div>
  );
}
