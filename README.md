# Arivo Landing Page

Static landing page for [Arivo](https://arivoai.in) — India's Financial Decision Engine.

## Stack

Plain HTML, a single CSS file (`assets/css/arivo.css`), and vanilla JS. No build step.

## Project structure

```
lendingPage/
├── index.html
├── assets/
│   ├── css/
│   │   ├── arivo.css          # Production stylesheet (use this)
│   │   └── style.legacy.css   # Archived — do not link
│   ├── js/
│   │   ├── main.js            # Forms, nav, video, scroll
│   │   ├── play.js            # Simulator & decision engine
│   │   └── form-config.js
│   ├── images/
│   └── videos/
└── README.md
```

## Local preview

```bash
python3 -m http.server 8080
```

Open http://localhost:8080 and hard-refresh (`Cmd+Shift+R`).

## Deploy

Push to `main` — GitHub Actions deploys the static site (see `.github/workflows/deploy.yml`).

## Forms

Beta and demo forms use [Web3Forms](https://web3forms.com). Key in `assets/js/form-config.js`.
