class VisualEditorWidget {
  constructor(elem) {
    this.elem = elem;

    this.reset();

    this.elem.onreset = () => queueMicrotask(this.reset.bind(this));
  }

  fields = {
    id: String,
    type: String,
    online: Boolean,
    url: String,
    title: String,
    author: Array,
    keywords: Array,
    publisher: String,
    issued: String,
    accessed: String,
    booktitle: String,
    edition: String,
  };

  reset() {
    this.elem.accessed.valueAsDate = new Date();
    this.elem.accessed.disabled = true;
  }

  generateObj() {
    const formData = new FormData(this.elem);

    const obj = {};
    formData.forEach((value, key) => {
      if (value) {
        switch (this.fields[key]) {
          case Array:
            obj[key] = value.split(',').map((item) => item.trim());
            break;
          case Boolean:
            obj[key] = true;
            break;
          default:
            obj[key] = value;
        }
      }
    });

    return obj;
  }

  populateForm(obj) {
    // map misnamed keys
    const mappings = {
      keyword: 'keywords',
      provider: 'publisher',
      published: 'issued',
      URL: 'url',
    };

    Object.entries(mappings).forEach(([key, mapped]) => {
      if (key in obj && !(mapped in obj)) {
        obj[mapped] = obj[key];
      }
    });

    [...this.elem.elements]
      .forEach((elem) => {
        const { name } = elem;
        let value = obj[elem.name];

        // post-processing
        if (name === 'online') elem.checked = obj.online;

        // don't clear fields that are not present
        if (!value) return;

        if (value instanceof Array) value = value.join(', ');

        if (name === 'accessed') {
          this.elem.accessedStatus.checked = true;
          this.elem.accessedStatus.dispatchEvent(new Event('change'));
        }

        if (name === 'issued') {
          value = value.split('T')[0];
        }

        if (value.raw) value = value.raw;
        if (value.literal) value = value.literal;

        elem.value = value;
        elem.dispatchEvent(new Event('change'));
      });
  }

  async fetchMetadata(endpoint, url) {
    const searchParams = new URLSearchParams();
    searchParams.set('url', url);

    try {
      const res = await fetch(`${endpoint}?${searchParams}`);
      if (res.status >= 400) throw new Error(`${res.status} ${res.statusText}\n${res.url}`);

      const metadata = await res.json();
      metadata.online = true;

      return metadata;
    } catch (err) {
      alert(err);
    }
  }
}

export default VisualEditorWidget;
