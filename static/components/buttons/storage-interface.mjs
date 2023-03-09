import idb from '/scripts/idb.js';

export default class extends DocumentFragment {
  constructor(options) {
    super();
    this.endpoint = options.endpoint;

    this.append(this.buttons.clearStorage);
    this.buttons.clearStorage.onclick = this.handlers.clearStorage.bind(this);

    this.append(this.buttons.resetDB);
    this.buttons.resetDB.onclick = this.handlers.resetDB.bind(this);

    this.append(this.buttons.syncDB);
    this.buttons.syncDB.onclick = this.handlers.syncDB.bind(this);

    this.handlers.syncDB.call(this);
  }

  buttons = {
    clearStorage: Object.assign(document.createElement('button'), {
      name: 'clear-storage',
      type: 'button',
      textContent: 'localStorage.clear()',
    }),

    resetDB: Object.assign(document.createElement('button'), {
      name: 'reset-db',
      type: 'button',
      textContent: 'idb.app reset',
    }),

    syncDB: Object.assign(document.createElement('button'), {
      name: 'sync-db',
      type: 'button',
      textContent: 'idb.app sync',
    }),
  };

  handlers = {
    clearStorage() {
      localStorage.clear();
    },

    resetDB() {
      [...idb.app.objectStoreNames].forEach((store) => idb.app.clear(store));
    },

    async syncDB() {
      const res = await fetch(this.endpoint);
      const data = await res.json();

      const tx = idb.app.transaction('entries', 'readwrite');
      await Promise.all([
        tx.store.clear(),
        ...data.map(((entry) => tx.store.put(entry))),
        tx.done,
      ]);
    },
  };
}
