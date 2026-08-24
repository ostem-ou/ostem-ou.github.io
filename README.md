# ostem-ou.github.io

The official website for **oSTEM @ OU** — the LGBTQ+ in STEM chapter at the University of Oklahoma. Hosted on GitHub Pages at [ostem-ou.github.io](https://ostem-ou.github.io).

## What this is

A pure static site: HTML, CSS, and a small amount of vanilla JavaScript. No build step, no bundler, no framework, no `npm install`. Every file here is exactly what gets served — open it in a browser or in an editor and what you see is what you get.

## Previewing locally

No server or tooling required. Open [index.html](index.html) directly in a browser (double-click it, or drag it into a browser window), or in VS Code use an extension like "Live Server" if you'd like auto-reload. Every page links to the others with relative paths, so navigation works straight from the filesystem.

## Deploying

This repo deploys via **GitHub Pages**, serving straight from the **`main` branch, root folder** — no Actions workflow, no build. Go to the repo's Settings → Pages, and confirm the source is set to `main` / `/ (root)`. Any push to `main` updates the live site within a minute or two.

The `.nojekyll` file at the repo root tells GitHub Pages to skip Jekyll processing and serve files as-is, since folders like `assets/` would otherwise be treated specially.

## Folder structure

```text
/index.html          Home
/about.html           Mission, vision, values
/team.html            Executive board + faculty advisor
/events.html          Upcoming and past events
/join.html            How to get involved
/brand.html           Links to brand assets and guidelines

/assets/css/styles.css   The one stylesheet every page shares
/assets/js/main.js       Mobile nav toggle + sticky header scroll effect
/assets/brand/           Logo files: flower.png, lockup-horizontal.svg, lockup-stacked.svg
/assets/images/          Photos and other page imagery

/docs/                Constitution and the brand guidelines PDF

/.nojekyll            Tells GitHub Pages not to run Jekyll
```

## For future officers

You do **not** need to know how to code to keep this site current. Everything is plain HTML — open a file in any text editor (VS Code is a good free choice), find the text you want to change, edit it, save, and push to `main`.

- **Updating event dates, officer names, or copy:** open the relevant `.html` file and edit the text between the tags. Placeholder content is marked with `<!-- TODO -->` comments — search for `TODO` to find everything that still needs real content.
- **Swapping a logo or adding photos:** drop new files into `/assets/brand/` (logos) or `/assets/images/` (photos), then update the `src="..."` path on the relevant `<img>` tag to match the new filename.
- **Changing colors, fonts, or spacing everywhere at once:** all of it lives in `/assets/css/styles.css`, in one place, at the very top under `:root`. Change a value there (like `--crimson: #841617;`) and it updates across all six pages — you never need to touch color or font values inside the individual HTML files.
- **The six-color spectrum bar** (the striped rule under the hero and in the footer) is a reusable pattern — copy this snippet anywhere you want it:

  ```html
  <div class="spectrum-bar" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span></div>
  ```

- **Adding a new page:** copy an existing page (like `about.html`) as a starting point so you keep the same header nav and footer, then replace the `<main>` content. Add a link to it in the `.nav-links` block on every page, including the new one.
- **The brand guidelines PDF** referenced from `brand.html` should live at `/docs/oSTEM-OU-brand-guidelines.pdf` — export the guidelines doc to PDF and drop it in `/docs/` under that exact filename, or update the link in `brand.html` to match whatever filename you use.

When in doubt, keep it warm, keep it Poppins-and-Inter, and keep Cream and Crimson doing most of the work — see `brand.html` and the full guidelines for the reasoning behind all of it.
