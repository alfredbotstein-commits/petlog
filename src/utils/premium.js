import { db } from '../db/database';

const FREE_PET_LIMIT = 2;

export async function isPremium() {
  const row = await db.settings.get('premium');
  return row?.value === true;
}

export async function canAddPet() {
  const premium = await isPremium();
  if (premium) return true;
  const count = await db.pets.count();
  return count < FREE_PET_LIMIT;
}

export async function setPremium(val) {
  await db.settings.put({ key: 'premium', value: val });
}

export const PREMIUM_FEATURES = [
  'Unlimited pets',
  'Vet visit PDF export',
  'Medication auto-reminders',
  'Photo journal',
  'Weight charts',
];
