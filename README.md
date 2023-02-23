refman/client
=============

> [`refman` project wiki](https://github.com/chrjl/reference-manager--project/wiki)

Architecture
------------

### Back-end

`nodejs` backend

- static file server (via `express`, `serve-static`, `serve-index`)
- API proxy (via `http-proxy-middleware`)

### Front-end

`app.html`

> Framework: HTML `iframe` communicating over Web Storage (`localStorage`), `fetch` from API server

- Controller for entries API
- Getter for metadata API
- Getter for archives API
- Client-side rendered view for uploaded JSON

`views/table-view.html`: viewer for entries API dump

> Framework: responsive HTML table, vanilla JS

- Client-side rendering (vanilla JS)
- Client-side view control (change `Event`, application of CSS classes)

### Client-side generation of download blobs

- archive (`.tgz`)
- entries dump to JSON (`.json`)
- entries dump formatted to biblatex (`.bib`)
- rendered table view with built-in styles and view control scripts (`.html`)

Fields supported
----------------

- id (required)
- type (required)
- online
- url
- title
- author (comma-separated list => json array)
- issued (string `yyyy[-mm-dd]`)
- accessed (date)
- keywords (comma-separated list => json array)
- [ ] extended (json object, TextEditor only)

Changes
-------

- [x] Widget `iframe`s change to pull model
  - Old method: push model (`postMessage` on change)
  - New method: pull model (widgets add `StorageEvent` listeners and handlers)

- [x] Add fetch date to `table-view`
- [x] `env` shared over `localStorage` instead of `window.[parent|opener]`
- [x] `Selector`, on `DELETE`: remove `<option>` element (old method: `refresh` from source)

UI

- [x] `Delete` keybinding on `selector`
- [x] Disable `DELETE` button on file upload

Syntax

- [x] `Selector`: change `select.append` to `select.add`
