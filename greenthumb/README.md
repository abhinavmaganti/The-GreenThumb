# 🌱 Green Thumb

> *Inspiring a shared food economy that brings us closer to local food grown in our back yards.*

**Better for you. Better for mother earth.**

---

## About

Green Thumb is a community platform for eco-friendly, sustainable home gardening. Our mission is to:

- Inspire a **shared food economy** rooted in local community
- Share learning on **sustainable, eco-friendly** home growing
- **Reduce carbon footprint** and protect the planet
- Connect neighbours through the joy of growing

---

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero, how it works, featured listings |
| `plants.html` | Plant Library — 140+ guides + growing calendar |
| `marketplace.html` | Share & Trade — local produce, seeds, tools |
| `community.html` | Community Forum — tips, questions, posts |
| `map.html` | Interactive map of local gardeners (Leaflet.js + OpenStreetMap) |
| `profile.html` | Sign in / Sign up / Profile management |

---

## Tech Stack

- Pure HTML, CSS, JavaScript — no build step required
- [Leaflet.js](https://leafletjs.com/) + OpenStreetMap for the interactive map
- [Google Fonts](https://fonts.google.com/) — Cormorant Garamond + DM Sans
- Hosted on [Vercel](https://vercel.com)

---

## Deploy to Vercel

### Option 1: Vercel Dashboard (easiest)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Click **Deploy** — no build settings needed!

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## Local Development

No build step needed — just open any HTML file directly or use a simple server:

```bash
# Python
python3 -m http.server 3000

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:3000`

---

## Project Structure

```
greenthumb/
├── index.html          # Home page
├── plants.html         # Plant Library
├── marketplace.html    # Marketplace
├── community.html      # Community Forum
├── map.html            # Local Map
├── profile.html        # Profile / Auth
├── css/
│   └── style.css       # All styles
├── js/
│   ├── layout.js       # Shared nav + footer
│   └── main.js         # Shared interactions
├── vercel.json         # Vercel config (clean URLs)
└── README.md
```

---

## Customisation

- **Colors**: Edit CSS variables in `css/style.css` (`:root` block)
- **Content**: Update text directly in each HTML file
- **Map markers**: Edit the `gardeners` array in `map.html`
- **Nav/Footer**: Edit the template strings in `js/layout.js`

---

*Made with 🌿 love — Better for you. Better for mother earth.*
