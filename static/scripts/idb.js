import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

const idb = {};

idb.app = await openDB('app', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('entries')) {
      const entriesStore = db.createObjectStore('entries', { keyPath: 'id' });
      entriesStore.createIndex('keyword', 'keywords', { multiEntry: true });
    }

    if (!db.objectStoreNames.contains('upload')) {
      const entriesStore = db.createObjectStore('upload', { keyPath: 'id' });
      entriesStore.createIndex('keyword', 'keywords', { multiEntry: true });
    }
  },
});

export default idb;
