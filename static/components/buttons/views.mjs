export default class extends DocumentFragment {
  constructor() {
    super();

    this.append(this.buttons.table);
    this.buttons.table.onclick = this.handlers.table.bind(this);

    this.append(this.buttons.json);
    this.buttons.json.onclick = this.handlers.json.bind(this);

    this.append(this.buttons.biblatex);
    this.buttons.biblatex.onclick = this.handlers.biblatex.bind(this);

    this.append(this.buttons.archive);
    this.buttons.archive.onclick = this.handlers.archive.bind(this);
  }

  get env() {
    return JSON.parse(localStorage.getItem('env'));
  }

  buttons = {
    table: Object.assign(document.createElement('button'), {
      type: 'button',
      name: 'view-table',
      textContent: 'html table',
    }),

    json: Object.assign(document.createElement('button'), {
      type: 'button',
      name: 'download-json',
      textContent: 'JSON (download)',
    }),

    biblatex: Object.assign(document.createElement('button'), {
      type: 'button',
      name: 'download-biblatex',
      textContent: 'BibLaTeX (download)',
    }),

    archive: Object.assign(document.createElement('button'), {
      type: 'button',
      name: 'download-archive',
      textContent: 'archive (download)',
    }),
  };

  handlers = {
    async download({ blob, basename, extname }) {
      const link = document.createElement('a');
      link.href = await URL.createObjectURL(blob);
      link.download = basename + extname;

      if (confirm(`Download ${link.download}?`)) {
        link.click();
      }

      URL.revokeObjectURL(link.href);
      link.remove();
    },

    table() {
      window.open('/views/table-view.html');
    },

    async json() {
      const { env } = this;

      const response = await fetch(env.API_SERVER + env.JSON_DUMP_ENDPOINT);
      const filetype = response.headers.get('content-type');
      const blob = await response.blob();

      this.handlers.download({
        blob,
        basename: `db_${new Date().toISOString()}`,
        extname: '.json',
      });
    },

    async archive() {
      const { env } = this;

      const response = await fetch(env.API_SERVER + env.ARCHIVE_ENDPOINT);
      const filetype = response.headers.get('content-type');
      const blob = await response.blob();

      this.handlers.download({
        blob,
        basename: `db_${new Date().toISOString()}`,
        extname: '.tgz',
      });
    },

    async biblatex() {
      const { env } = this;

      const response = await fetch(env.API_SERVER + env.JSON_DUMP_ENDPOINT);
      const filetype = response.headers.get('content-type');
      const model = await response.json();

      const blob = new Blob([generateBib(model)], { type: 'text/x-bibtex' });

      this.handlers.download({
        blob,
        basename: `db_${new Date().toISOString()}`,
        extname: '.bib',
      });

      function generateBib(model) {
        const fields = [
          'author',
          'title',
          'booktitle',
          'edition',
          'publisher',
          'date',
          'url',
          'urldate',
          'keywords',
        ];

        const entries = model.map((entry) => {
          // preprocessing
          Object.assign(entry, {
            author: entry.author?.join(' and '),
            keywords: entry.keywords?.join(','),
            date: entry.issued,
            urldate: entry.accessed,
            type: entry.online ? 'online' : entry.type,
          });

          // build entry fields and return bibliography entry
          const biblatex = fields.reduce((arr, field) => {
            if (entry[field]) arr.push(`${field}={${entry[field]}}`);
            return arr;
          }, []);

          return `@${entry.type}{${entry.id},\n  ${biblatex.join(',\n  ')}\n}`;
        });

        return entries.join('\n\n');
      }
    },
  };
}
