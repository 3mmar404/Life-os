// Singularity - IndexedDB (Dexie.js) Wrapper
import Dexie from 'https://cdn.jsdelivr.net/npm/dexie@3.2.4/dist/dexie.mjs';

export const db = new Dexie('LifeOSDatabase');
db.version(1).stores({
    passwords: '++id, platform, username',
    contacts: '++id, name',
    bookmarks: '++id, url',
    settings: 'key'
});

// مثال: await db.passwords.add({platform: 'Google', username: 'user', password: 'pass', tags: []});
