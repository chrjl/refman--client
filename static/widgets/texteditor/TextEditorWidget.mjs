class TextEditorWidget {
  constructor(url) {
    this.collectionEndpoint = url;

    this.textarea.setAttribute('wrap', 'off');
  }

  textarea = document.createElement('textarea');

  async POST() {
    const data = JSON.parse(this.textarea.value);
    const endpoint = this.collectionEndpoint;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status >= 400) throw new Error(`${res.status} ${res.statusText}`);

    return data;
  }

  async PUT() {
    const data = JSON.parse(this.textarea.value);
    const endpoint = `${this.collectionEndpoint}/${data.id}`;

    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status >= 400) throw new Error(`${res.status} ${res.statusText}`);

    return data;
  }

  clear() {
    this.textarea.value = '';
  }
}

export default TextEditorWidget;
