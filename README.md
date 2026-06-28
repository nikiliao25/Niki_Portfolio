# Niki Liao — Portfolio

Personal portfolio for **Niki Liao**, Software & Machine Learning Engineer.
Hand-built static site — no framework, no build step — so it deploys anywhere,
including GitHub Pages.

🔗 **Live:** https://nikiliao25.github.io/Niki_Portfolio/

## Highlights

- Custom design system (dark + light theme, no template)
- Responsive, accessible, keyboard-navigable
- Animated stat counters, scroll-spy nav, reveal-on-scroll
- Custom SVG project artwork (no stock imagery)
- Filterable project gallery
- Working contact form (Formspree-ready, with a mailto fallback)
- SEO + Open Graph + JSON-LD structured data

## Structure

```
index.html              # All page content
assets/
  css/styles.css        # Design system + components
  js/app.js             # Theme, nav, animations, contact form
  Niki_Liao_Resume.pdf  # Downloadable résumé
images/
  headshot.jpg          # Hero portrait (600×600) — swap to update your photo
  og-image.png          # Social share preview (1200×630)
```

## Run locally

```bash
# any static server works, e.g.
python3 -m http.server 4321
# then open http://localhost:4321
```

## Deploy to GitHub Pages

1. Push these files to your repo.
2. In **Settings → Pages**, set the source to the `main` branch, root (`/`).
3. For a root URL (`nikiliao25.github.io`) name the repo `nikiliao25.github.io`.
   For a project URL (`nikiliao25.github.io/<repo>`) any repo name works — just
   update the absolute `og:url` / `canonical` URLs in `index.html` to match.

## Enabling the contact form (optional API)

The form works out of the box via a `mailto:` fallback. To make it send messages
without opening an email client:

1. Create a free form at **https://formspree.io** and copy your endpoint
   (e.g. `https://formspree.io/f/abcdwxyz`).
2. In `assets/js/app.js`, set:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```

That's it — submissions are then POSTed as JSON and delivered to your inbox.

## Updating content

All copy lives in `index.html`. To add a project, copy a `.project-card`
block, swap the text/tags/links, and (optionally) the inline SVG thumbnail.
