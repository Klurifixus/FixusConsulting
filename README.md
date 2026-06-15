# Fixus Consulting

One-page marketing site for **Fixus Consulting** — Pierre Nilsson's *embedded operations consultant* offer: operativ förstärkning som samtidigt förbättrar verksamheten inifrån.

Built as a static site (HTML + CSS + JS, no build step) from the Claude Design handoff.

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
| `index.html` | The page — semantic sections (Hero → Värde → Positionering → Uppdrag → Roll → Uppdragsmodell → Paket → Prislogik → FAQ → Kontakt). Includes favicon, social-share (Open Graph/Twitter) and JSON-LD structured data in `<head>`. |
| `fixus.css` | Visual system: design tokens (`:root`), layout, components, responsive rules. Spectral (serif) + Schibsted Grotesk (sans), deep-green/graphite/warm-paper palette. |
| `fixus.js` | Motion & interaction: scroll reveals, the hero growth-arrow draw, the scroll-driven uppdragsmodell, nav state, mobile menu, scroll progress. Also wires the booking CTAs (see below). |
| `assets/` | `fixus-mark.png` (logo mark), `pierre.jpg` (portrait). |

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
