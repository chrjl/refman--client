import idb from '/scripts/idb.js';

export default class extends DocumentFragment {
  constructor(options) {
    super();
    this.endpoint = options.endpoint;
    this.buffer = JSON.parse(localStorage.getItem('buffer'));

    window.addEventListener('storage', (event) => {
      if (event.key !== 'buffer') return;
      this.buffer = JSON.parse(localStorage.getItem('buffer'));
    });

    this.append(this.buttons.POST);
    this.buttons.POST.onclick = async () => {
      this.uiHandler.setBuffer.call(this);

      await this.fetchHandler.POST.call(this);
      await this.storageHandler.POST.call(this);

      this.uiHandler.POST(this.buffer);
    };

    this.append(this.buttons.PUT);
    this.buttons.PUT.onclick = async () => {
      await this.fetchHandler.PUT.call(this);
      await this.storageHandler.PUT.call(this);
    };

    this.append(this.buttons.DELETE);
    this.buttons.DELETE.onclick = async () => {
      if (!confirm(`DELETE ${this.buffer.id}?`)) return;

      await this.fetchHandler.DELETE.call(this);
      await this.storageHandler.DELETE.call(this);

      this.uiHandler.DELETE(this.buffer);
    };
  }

  buttons = {
    POST: Object.assign(document.createElement('button'), {
      name: 'POST',
      type: 'button',
      textContent: 'POST (buffer)',
    }),

    PUT: Object.assign(document.createElement('button'), {
      name: 'PUT',
      type: 'button',
      textContent: 'PUT (buffer)',
    }),

    DELETE: Object.assign(document.createElement('button'), {
      name: 'DELETE',
      type: 'button',
      textContent: 'DELETE (buffer)',
    }),
  };

  fetchHandler = {
    async POST() {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(this.buffer),
      });

      const statusMessage = `${res.status} ${res.statusText}`;
      if (res.status >= 400) throw new Error(statusMessage);
    },

    async PUT() {
      const res = await fetch(`${this.endpoint}/${this.buffer.id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(this.buffer),
      });

      const statusMessage = `${res.status} ${res.statusText}`;
      if (res.status >= 400) throw new Error(statusMessage);
    },

    async DELETE() {
      const res = await fetch(`${this.endpoint}/${this.buffer.id}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(this.buffer),
      });

      const statusMessage = `${res.status} ${res.statusText}`;
      if (res.status >= 400) throw new Error(statusMessage);
    },
  };

  storageHandler = {
    async POST() {
      idb.app.add('entries', this.buffer);
    },

    async PUT() {
      idb.app.put('entries', this.buffer);
    },

    async DELETE() {
      idb.app.delete('entries', this.buffer.id);
      localStorage.removeItem('buffer');
    },
  };

  uiHandler = {
    get selector() {
      const selectorFrame = document.getElementById('selector');
      return selectorFrame.contentDocument.querySelector('select');
    },

    setBuffer() {
      const textarea = document.getElementById('texteditor')
        .contentDocument
        .querySelector('textarea');

      try {
        this.buffer = JSON.parse(textarea.value || {});
      } catch (err) {
        if (err instanceof SyntaxError) {
          alert('invalid JSON in textarea');
          return;
        }

        throw err;
      }

      localStorage.setItem('buffer', JSON.stringify(this.buffer));
    },

    async POST(buffer) {
      const option = document.createElement('option');
      Object.assign(option, {
        id: buffer.id,
        textContent: buffer.id,
      });

      this.selector.prepend(option);
      this.selector.value = buffer.id;
    },

    async DELETE(buffer) {
      this.selector.children.namedItem(buffer.id).remove();
    },
  };
}
