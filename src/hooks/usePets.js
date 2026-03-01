import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function usePets() {
  return useLiveQuery(() => db.pets.orderBy('createdAt').toArray()) ?? [];
}

export function usePet(id) {
  return useLiveQuery(() => (id ? db.pets.get(Number(id)) : undefined), [id]);
}

export function useActivities(petId, limit = 50) {
  return useLiveQuery(
    () =>
      petId
        ? db.activities
            .where('petId')
            .equals(Number(petId))
            .reverse()
            .sortBy('timestamp')
            .then((a) => a.slice(0, limit))
        : [],
    [petId, limit]
  ) ?? [];
}

export function useAllActivities(limit = 100) {
  return useLiveQuery(
    () => db.activities.orderBy('timestamp').reverse().limit(limit).toArray()
  ) ?? [];
}

export function useReminders() {
  return useLiveQuery(() => db.reminders.orderBy('dateTime').toArray()) ?? [];
}

export function useVetVisit(id) {
  return useLiveQuery(() => (id ? db.vetVisits.get(Number(id)) : undefined), [id]);
}
