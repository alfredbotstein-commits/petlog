import Dexie from 'dexie';

export const db = new Dexie('PetLogDB');

db.version(1).stores({
  pets: '++id, name, species, createdAt',
  activities: '++id, petId, type, timestamp, vetVisitId',
  vetVisits: '++id, petId, date, reason',
  reminders: '++id, petId, type, dateTime, completed',
  settings: 'key',
});

// Seed default settings
db.on('populate', () => {
  db.settings.bulkAdd([
    { key: 'units', value: 'lbs' },
    { key: 'dateFormat', value: 'MM/dd/yyyy' },
    { key: 'defaultView', value: 'grid' },
    { key: 'theme', value: 'system' },
    { key: 'premium', value: false },
    { key: 'onboardingComplete', value: false },
  ]);
});
