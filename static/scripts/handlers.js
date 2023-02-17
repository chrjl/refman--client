async function download({ blob, basename, extname }) {
  const link = document.createElement('a');
  link.href = await URL.createObjectURL(blob);
  link.download = basename + extname;

  if (confirm(`Download ${link.download}?`)) {
    link.click();
  }

  URL.revokeObjectURL(link.href);
  link.remove();
}

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
    entry.author = entry.author?.join(' and ');
    entry.keywords = entry.keywords?.join(',');
    entry.date = entry.issued;
    entry.urldate = entry.accessed;

    if (entry.online) entry.type = 'online';

    // build entry fields and return bibliography entry
    const biblatex = fields.reduce((arr, field) => {
      if (entry[field]) arr.push(`${field}={${entry[field]}}`);
      return arr;
    }, []);

    return `@${entry.type}{${entry.id},\n  ${biblatex.join(',\n  ')}\n}`;
  });

  return entries.join('\n\n');
}

export default { download, generateBib };
