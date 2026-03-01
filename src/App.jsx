import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import BottomSheet from './components/BottomSheet';
import QuickAddSheet from './components/QuickAddSheet';
import MyPets from './pages/MyPets';
import PetDetail from './pages/PetDetail';
import AddPet from './pages/AddPet';
import VetVisit from './pages/VetVisit';
import Timeline from './pages/Timeline';
import Reminders from './pages/Reminders';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import { useSetting } from './hooks/useSetting';

function AppShell() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [onboardingDone, setOnboardingDone] = useSetting('onboardingComplete');
  const [theme] = useSetting('theme');

  useEffect(() => {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else if (theme === 'light') document.documentElement.removeAttribute('data-theme');
    else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () => {
        if (mq.matches) document.documentElement.setAttribute('data-theme', 'dark');
        else document.documentElement.removeAttribute('data-theme');
      };
      apply();
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);

  if (onboardingDone === undefined) return null; // loading
  if (!onboardingDone) return <Onboarding onComplete={() => setOnboardingDone(true)} />;

  return (
    <div className="app-layout">
      <Routes>
        <Route path="/" element={<MyPets />} />
        <Route path="/pet/:id" element={<PetDetail />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/edit-pet/:id" element={<AddPet />} />
        <Route path="/vet-visit/:petId" element={<VetVisit />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      <button
        className="fab"
        onClick={() => setShowQuickAdd(true)}
        aria-label="Quick add activity"
      >
        +
      </button>

      <nav className="tab-bar" role="navigation" aria-label="Main navigation">
        <NavLink to="/" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`} end aria-label="My Pets">
          <span className="tab-icon" aria-hidden="true">🐾</span>
          My Pets
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`} aria-label="Timeline">
          <span className="tab-icon" aria-hidden="true">📋</span>
          Timeline
        </NavLink>
        <NavLink to="/reminders" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`} aria-label="Reminders">
          <span className="tab-icon" aria-hidden="true">🔔</span>
          Reminders
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `tab-item ${isActive ? 'active' : ''}`} aria-label="Settings">
          <span className="tab-icon" aria-hidden="true">⚙️</span>
          Settings
        </NavLink>
      </nav>

      <BottomSheet open={showQuickAdd} onClose={() => setShowQuickAdd(false)} title="Quick Add">
        <QuickAddSheet onClose={() => setShowQuickAdd(false)} />
      </BottomSheet>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}
