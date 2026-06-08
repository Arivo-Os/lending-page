# Arivo OS Landing Page

Static landing page for [Arivo OS](https://github.com/Arivo-Os/lending-page) — India's Financial Operating System.

## Project structure

```
lending-page/
├── index.html          # Main page (GitHub Pages entry point)
├── assets/
│   ├── css/
│   │   └── style.css   # Styles
│   └── js/
│       └── main.js     # Form handling & interactions
├── .nojekyll           # Disables Jekyll processing on GitHub Pages
└── README.md
```

## Deploy on GitHub Pages

1. Push this repo to GitHub (`Arivo-Os/lending-page`).
2. Go to **Settings → Pages** in the repository.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch **`main`** and folder **`/ (root)`**.
5. Click **Save**. Your site will be live at:

   **https://arivo-os.github.io/lending-page/**

Changes pushed to `main` are published automatically (may take 1–2 minutes).

## Forms & email

Beta and demo submissions are sent via [Web3Forms](https://web3forms.com) to `akhileshgoswami@arivoai.in`.

**One-time setup (required):**

1. Go to [web3forms.com](https://web3forms.com) and enter `akhileshgoswami@arivoai.in`
2. Copy the access key from your inbox
3. Paste it in `assets/js/form-config.js`:

```js
window.ARIVO_FORM = {
  web3formsAccessKey: 'YOUR_KEY_HERE',
};
```

4. Push to GitHub — forms will work on the live site

> FormSubmit was replaced because their servers were returning errors (HTTP 521).

## Local preview

```bash
# Python
python3 -m http.server 8080

# or Node.js
npx serve .
```

Open http://localhost:8080
