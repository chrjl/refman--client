class SelectorWidget {
  constructor() {
    this.select.setAttribute('size', 2);
  }

  data = {};

  select = document.createElement('select');

  static async from({ server, api }) {
    const selector = new SelectorWidget();

    selector.server = server;
    selector.api = api;
    selector.refresh();

    return selector;
  }

  // METHODS

  get selected() {
    const { select } = this;

    const option = select.options[select.selectedIndex];
    if (option) option.endpoint = option?.links?.find((link) => link.rel === 'self').href;

    return option;
  }

  async populate() {
    // populate <select> with <option> elements
    // async populate(entries) {

    const { select } = this;
    const entries = JSON.parse(localStorage.getItem('entries'));

    entries.forEach((entry) => {
      const option = document.createElement('option');
      option.textContent = entry.id;

      const { links, ...data } = entry;

      option.data = data;
      option.links = links;

      select.add(option);
    });
  }

  async refresh(arr) {
    // fill <select> with <options> using populate method
    // if arr is not provided: fetch data from api server
    let entries = [];

    if (arr) {
      entries = arr;
    } else if (this.server) {
      const response = await fetch(this.server + this.api);
      entries = await response.json();
    }

    this.select.innerHTML = '';
    localStorage.removeItem('entries');
    localStorage.setItem('entries', JSON.stringify(entries));

    this.populate();
  }

  follow() {
    if (this.data.url) window.open(this.data.url);
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
    if (!this.selected.endpoint) return;

    const path = this.server + this.selected.endpoint;

    try {
      const res = await fetch(path, { method: 'DELETE' });

      const statusMessage = `${res.status} ${res.statusText}`;
      if (res.status >= 400) throw new Error(statusMessage);

      localStorage.removeItem('buffer');
    } catch (err) {
      alert(err);
    }
  }
}

export default SelectorWidget;
