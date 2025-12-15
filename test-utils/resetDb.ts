import { db } from '@/lib/db';

export function resetDb() {
  db._reset?.();

}