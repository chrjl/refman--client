class SelectorWidget {
  constructor(arr) {
    this.select.setAttribute('size', 10);

    if (arr) this.populate(arr);
  }

  static async from({ server, api }) {
    const selector = new SelectorWidget();

    selector.server = server;
    selector.api = api;
    selector.refresh();

    return selector;
  }

  // FIELDS

  data = {};

  select = document.createElement('select');

  get selected() {
    const { select } = this;

    const option = select.options[select.selectedIndex];
    if (option) option.endpoint = option?.links?.find((link) => link.rel === 'self').href;

    return option;
  }

  // METHODS

  async populate(entries) {
    const { select } = this;

    entries.forEach((entry) => {
      const option = document.createElement('option');
      option.textContent = entry.id;

      const { links, ...data } = entry;

      option.data = data;
      option.links = links;

      select.append(option);
    });
  }

  follow() {
    if (this.data.url) window.open(this.data.url);
  }

  async refresh(obj) {
    let entries = {};

    if (obj) {
      this.select.innerHTML = '';
      this.populate(obj);
      return;
    }

    if (this.server) {
      const response = await fetch(this.server + this.api);
      entries = await response.json();

      this.select.innerHTML = '';
      await this.populate(entries);
    }
  }

  async GET() {
    // fetch new data if href to endpoint is provided
    if (this.selected.endpoint) {
      const path = this.server + this.selected.endpoint;
      const res = await fetch(path);

      this.data = await res.json();
    } else {
      this.data = this.selected.data;
    }

    return this.data;
  }

  async DELETE() {
    // const endpoint = this.selected.links?.find((link) => link.rel === 'self').href;

    if (!this.selected.endpoint) return;

    const path = this.server + this.selected.endpoint;

    try {
      const res = await fetch(path, { method: 'DELETE' });
      const statusMessage = `${res.status} ${res.statusText}`;

      if (res.status >= 400) throw new Error(statusMessage);
    } catch (err) {
      alert(err);
    }
  }
}

export default SelectorWidget;
