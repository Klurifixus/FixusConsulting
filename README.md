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

Serving (rather than `file://`) is recommended so the self-hosted fonts and relative
asset paths behave exactly as in production.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | The page — **profile + catalogue** semantic sections: Hero (person först, faktarad) → I verkligheten (yrkeskarusell) → Tjänster (tre ingångar i kundens språk, de fem Fixus-uppläggen som chips) → Så går det till (process) → Branscher (+ för vem/var) → Om Pierre → FAQ → Kontakt (+ "Annat jag driver": bok, HazardLink, MaxAI). Service details are visible HTML (no JS modal). `<head>` has canonical, Open Graph/Twitter, and JSON-LD (`Organization` + `WebSite` + `Person` graph, plus a `FAQPage`). |
| `fixus.css` | Visual system: design tokens (`:root`), layout, components, `:focus-visible`, responsive rules. Spectral (serif) + Schibsted Grotesk (sans); deep-green/graphite/warm-paper palette. |
| `fixus.js` | Motion & interaction: scroll reveals, the hero arrow draw, the scroll-driven process steps, nav state, mobile menu, scroll progress, the yrkeskarusell. Also wires the booking CTAs (see below). |
| `assets/` | `fixus-mark.png` (logo), `pierre.jpg` (portrait), `thrive-and-prosper.jpg` (book cover), `hazardlink-poster.jpg` + `maxai-mark.webp` (ventures), `yrken/*.webp` (carousel + entry backgrounds), `fonts/` (self-hosted). |
| `robots.txt`, `sitemap.xml`, `404.html`, `.nojekyll` | SEO/technical: crawl rules + sitemap, a styled 404 page, and the Jekyll opt-out for GitHub Pages. |
| `uppdragsbeskrivning.html` | Standalone "beskriv ditt uppdrag" form (matches the design); compiles its fields into a prefilled `mailto:` to pirre@fixusconsulting.se. Linked from every booking CTA and the "Osäker på vilken ingång?" block in Tjänster. Self-contained — its own inline script, no backend. |

> **Custom domain:** `fixusconsulting.se` is registered at STRATO; DNS stays at STRATO (so the STRATO mailbox keeps working) with the apex `A` record → `185.199.108.153` and `www` `CNAME` → `klurifixus.github.io`. The repo `CNAME` file sets the GitHub Pages custom domain. Canonical, OG/Twitter image, JSON-LD `@id`/url, `robots.txt` and `sitemap.xml` use `https://fixusconsulting.se/`.

## Booking flow

Every **"Boka ett första samtal"** button routes to the
**uppdragsbeskrivning form** (`uppdragsbeskrivning.html`) — so a prospect
describes their assignment (kontakt + nuläge + mål + omfattning) *before*
the first contact, giving Pierre real data to prepare with. The form then
compiles its fields into a prefilled `mailto:` to `pirre@fixusconsulting.se`.

The destination is one line at the top of **`fixus.js`** — every booking
button (hero, nav, the three entry cards, mobile menu, sticky bar, footer,
contact card) repoints automatically:

```js
var BOOKING_URL = '';   // optional Google Calendar link; empty = the brief form
```

Leave `BOOKING_URL` empty to use the form. To switch the buttons to a live
Google **Appointment schedule** link instead, paste it into `BOOKING_URL`
(looks like `…/calendar/u/0/appointments/schedules/<token>`, not the generic
`…/calendar/u/0/r` link).

## Contact details (already wired)

- E-post: `pirre@fixusconsulting.se`
- Telefon: `+46 76 213 27 81`
- LinkedIn: <https://www.linkedin.com/in/pierre-nilsson-657017162/>

## Accessibility & motion

Respects `prefers-reduced-motion`: animations are disabled and all
scroll-revealed content is shown immediately for users who opt out.
