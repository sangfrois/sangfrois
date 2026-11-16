# François Lespinasse — Research / Creation

Portfolio and seven-page PDF CV. Self-hosted Goudy Bookletter 1911 and Fragment Mono typography, dark textured background, scroll parallax, interactive gesture/response drawing, six-photo gallery, and a responsive Vimeo embed for The Monolith.

## Preview and build

Node.js 20 or newer; no dependency installation needed for these commands:

```sh
cd redesign
npm run dev
npm run check
npm run build
```

The preview address is printed by the server. Build output is written to `dist/`.

## Cloudflare Workers

```sh
npm install
npm run build
npx wrangler login
npm run deploy
```

For Cloudflare Git integration, use `redesign` as the root directory, `npm run build` as the build command, and `npx wrangler deploy` as the deploy command. `wrangler.jsonc` binds `dist/` to `ASSETS`; `worker.js` serves the assets with security headers. No application secrets or database are required. Deployment to the user's Cloudflare account has not been performed.

The original GitHub Pages source remains at repository root. This directory is the complete replacement application, ready for independent deployment.

## Content and PDF

- `content/cv.json`: canonical CV entries and documentation links.
- `public/index.html`: portfolio content, project film and contact form.
- `public/style.css`: typography, layout, colour and texture layers.
- `public/app.js`: gesture study, gallery and reduced-motion-aware parallax.
- `public/images/mechanical-meanderings/`: project photographs.

Regenerate the PDF and full HTML CV from this directory:

```sh
python -m pip install reportlab
python scripts/render_cv.py
npm run build
```

Contact uses the existing Formspree endpoint; no personal email address is included in this application's source or PDF. The endpoint requires its owner's Formspree configuration to remain active.

## Assets and verification

Fonts include their SIL Open Font Licenses. Photographs come from the kairos~hive Mechanical Meanderings gallery; artwork and photography retain their original rights. The film is hosted by Milieux Institute on Vimeo. Textural graphics are SVG; the feedback drawing is an illustrative interaction, not physiological measurements.

Asset/link and JavaScript syntax checks pass. Desktop and narrow-screen gallery navigation, feedback controls and contact layout were inspected in-browser; the Vimeo player loads. No contact message was sent. The PDF was rendered and visually reviewed. Cloudflare account deployment remains untested.

## Research profiles

- [Google Scholar](https://scholar.google.com/citations?user=VjJntXAAAAAJ&hl=en&oi=ao)
- [ResearchGate](https://www.researchgate.net/profile/Francois-Lespinasse)
