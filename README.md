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

Waitlist and demo submissions are sent to `akhileshgoswami@arivoai.in` via [FormSubmit](https://formsubmit.co).

On first submission, check that inbox and click **Activate Form** in the FormSubmit confirmation email.

## Local preview

```bash
# Python
python3 -m http.server 8080

# or Node.js
npx serve .
```

Open http://localhost:8080
