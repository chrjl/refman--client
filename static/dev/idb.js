import { openDB } from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

const idb = {};

idb.app = openDB('app', 1, {
  upgrade(db) {
    db.createObjectStore('entries', { keyPath: 'id' });
  },
});

idb.app.clearEntries = async () => {
  const db = await idb.app;
  db.clear('entries');
};

idb.app.putEntries = async (data) => {
  const db = await idb.app;
  data.forEach((entry) => db.put('entries', entry));
};

export default idb;
