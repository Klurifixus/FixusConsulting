# Fixus Consulting

One-page marketing site for **Fixus Consulting** — Pierre Nilsson's *operativ konsult- och interimförstärkning*: praktiskt genomförande, tillfällig arbetsledning, verksamhetsanalys och förbättringsarbete, på plats i verksamheten. Baserat i Vårgårda, uppdrag i Västra Götaland.

Built as a static site (HTML + CSS + JS, no build step), published via **GitHub Pages from `main`/root** on the custom domain **https://fixusconsulting.se/** (set by the repo-root `CNAME` file; `klurifixus.github.io/FixusConsulting/` now redirects there).

## Run locally

It's a static site — open `index.html` directly, or serve the folder:

```bash
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

Serving (rather than `file://`) is recommended so the Google Fonts and relative
asset paths behave exactly as in production.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | The page — **problem-first** semantic sections: Hero → När verksamheten inte kan vänta → Tjänster (5 paket) → Så går det till (process) → Branscher → Om Pierre → Yrkeskarusell → FAQ → Kontakt. Service details are visible HTML cards (no JS modal). `<head>` has canonical, Open Graph/Twitter, and JSON-LD (`Organization` + `WebSite` + `Person` graph, plus a `FAQPage`). |
| `fixus.css` | Visual system: design tokens (`:root`), layout, components, `:focus-visible`, responsive rules. Spectral (serif) + Schibsted Grotesk (sans); deep-green/graphite/warm-paper palette. |
| `fixus.js` | Motion & interaction: scroll reveals, the hero arrow draw, the scroll-driven process steps, nav state, mobile menu, scroll progress, the yrkeskarusell. Also wires the booking CTAs (see below). |
| `assets/` | `fixus-mark.png` (logo), `pierre.jpg` (portrait), `thrive-and-prosper.jpg` (book cover), `yrken/*.webp` (carousel). |
| `robots.txt`, `sitemap.xml`, `404.html`, `.nojekyll` | SEO/technical: crawl rules + sitemap, a styled 404 page, and the Jekyll opt-out for GitHub Pages. |

> **Custom domain:** `fixusconsulting.se` is registered at STRATO; DNS stays at STRATO (so the STRATO mailbox keeps working) with the apex `A` record → `185.199.108.153` and `www` `CNAME` → `klurifixus.github.io`. The repo `CNAME` file sets the GitHub Pages custom domain. Canonical, OG/Twitter image, JSON-LD `@id`/url, `robots.txt` and `sitemap.xml` use `https://fixusconsulting.se/`.

## Booking flow

Calendar booking is **deferred for now**. Until it's enabled, every
"Boka ett samtal" / "Begär offert" button opens a prefilled
**interesseanmälan** e-post (namn / företag / telefon / behov) to
`Pirrefixus@gmail.com` — so Pierre gets a number to call back.

To switch to live calendar booking later, open **`fixus.js`** and set one
line at the top — every button repoints automatically:

```js
var BOOKING_URL = '';   // ← paste your Google Calendar appointment-scheduling link
```

> A Google **Appointment schedule** booking link is required (looks like
> `…/calendar/u/0/appointments/schedules/<token>`), not the generic
> `…/calendar/u/0/r` app link. Create one via Calendar → Create →
> Appointment schedule → Share → "Open booking page".

## Contact details (already wired)

- E-post: `Pirrefixus@gmail.com`
- Telefon: `+46 76 213 27 81`
- LinkedIn: <https://www.linkedin.com/in/pierre-nilsson-657017162/>

## Accessibility & motion

Respects `prefers-reduced-motion`: animations are disabled and all
scroll-revealed content is shown immediately for users who opt out.
