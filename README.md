# Awesome OSINT For Everything

A searchable OSINT directory built with React + Vite.

This project turns a large Markdown list of OSINT resources into a fast,
filterable web interface with category chips, keyboard shortcuts, and
infinite scroll.

## Live Demo

- GitHub Pages: [https://krishnaborude.github.io/all_tools/](https://krishnaborude.github.io/all_tools/)

## Features

- Search across more than 1,500 OSINT resources
- Filter tools by section/category
- Auto-load additional results while scrolling
- Keyboard shortcuts:
  - `/` focuses search
  - `Esc` clears filters
- GitHub Pages deployment via GitHub Actions

## Quick Start

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Data Source Workflow

The tool catalog source is kept in:

- [`docs/TOOLS.md`](docs/TOOLS.md)

Generate the app data JSON after any catalog update:

```bash
npm run sync:data
```

This command regenerates:

- `src/data/osint-tools.json`

## Documentation

- [Documentation Index](docs/README.md)
- [Setup Guide](docs/SETUP.md)
- [Data Pipeline](docs/DATA_PIPELINE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Full Tools Catalog](docs/TOOLS.md)

## Tech Stack

- React 18
- Vite 5
- GSAP (custom cursor animation)
