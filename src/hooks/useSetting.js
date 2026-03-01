import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function useSetting(key) {
  const row = useLiveQuery(() => db.settings.get(key), [key]);
  const value = row?.value;
  const set = async (v) => db.settings.put({ key, value: v });
  return [value, set];
}
