import { differenceInYears, differenceInMonths, format, isToday, isYesterday } from 'date-fns';

export function petAge(birthday) {
  if (!birthday) return null;
  const d = new Date(birthday);
  const y = differenceInYears(new Date(), d);
  const m = differenceInMonths(new Date(), d) % 12;
  if (y > 0) return `${y}y ${m}m`;
  return `${m}m`;
}

export function groupByDate(items) {
  const groups = {};
  for (const item of items) {
    const d = new Date(item.timestamp);
    let label;
    if (isToday(d)) label = 'Today';
    else if (isYesterday(d)) label = 'Yesterday';
    else label = format(d, 'MMM d, yyyy');
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }
  return groups;
}

export const SPECIES = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'bird', label: 'Bird', emoji: '🐦' },
  { value: 'fish', label: 'Fish', emoji: '🐟' },
  { value: 'reptile', label: 'Reptile', emoji: '🦎' },
  { value: 'small_animal', label: 'Small Animal', emoji: '🐹' },
  { value: 'other', label: 'Other', emoji: '🐾' },
];

export const ACTIVITY_TYPES = [
  { value: 'fed', label: 'Fed', emoji: '🍕' },
  { value: 'walked', label: 'Walked', emoji: '🚶' },
  { value: 'groomed', label: 'Groomed', emoji: '✂️' },
  { value: 'medication', label: 'Medication', emoji: '💊' },
  { value: 'weighed', label: 'Weighed', emoji: '⚖️' },
  { value: 'vet_visit', label: 'Vet Visit', emoji: '🏥' },
  { value: 'photo', label: 'Photo', emoji: '📸' },
  { value: 'custom', label: 'Custom', emoji: '✏️' },
];

export const SPECIES_COLORS = {
  dog: '#A67B5B',
  cat: '#9B8EC4',
  bird: '#6BB5D9',
  fish: '#4DBFB5',
  reptile: '#8BA86B',
  small_animal: '#E8A087',
  other: '#9E9EA8',
};

export const VET_REASONS = ['checkup', 'vaccination', 'illness', 'injury', 'surgery', 'dental', 'other'];

export const VACCINATION_PRESETS = {
  dog: ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis', 'Lyme', 'Canine Influenza'],
  cat: ['Rabies', 'FVRCP', 'FeLV', 'FIV'],
  bird: ['Polyomavirus', 'PBFD'],
};

export function getSpeciesEmoji(species) {
  return SPECIES.find((s) => s.value === species)?.emoji ?? '🐾';
}

export function getActivityEmoji(type) {
  return ACTIVITY_TYPES.find((a) => a.value === type)?.emoji ?? '📝';
}

export function generateId() {
  return Date.now();
}
