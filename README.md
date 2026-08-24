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

/assets/css/styles.css   The one stylesheet every page shares
/assets/js/main.js       Mobile nav toggle + sticky header scroll effect
/assets/js/sheets.js     Pulls team/event data from Google Sheets (see below) — don't edit
/assets/data/sheet-config.js   The ONE file officers edit to point at their Sheet
/assets/brand/           Logo files: flower.png, lockup-horizontal.svg, lockup-stacked.svg
/assets/images/          Photos and other page imagery
/assets/images/team/     Officer/advisor headshots, referenced by filename from the Sheet

/docs/                Constitution and other reference documents

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

### Updating the team and events pages without touching any code

The Team and Events pages (and the "Upcoming events" preview on Home) can pull live from a **Google Sheet** instead of the hardcoded placeholder cards — so a future officer only ever edits a spreadsheet, never HTML.

1. Make a Google Sheet with two tabs, **Team** and **Events**, using these exact column headers in row 1 (order doesn't matter, extra columns are ignored):

   **Team tab:**

   | Column | Notes |
   | --- | --- |
   | `type` | `officer` or `advisor`. Leave blank to default to `officer`. |
   | `name` | Full name. |
   | `role` | e.g. `President`, `Faculty Advisor`. |
   | `pronouns` | e.g. `she/her`. Leave blank for "choose not to share." |
   | `bio` | One or two sentences. |
   | `photo` | Filename only (e.g. `jordan.jpg`) — upload the actual image to `/assets/images/team/` in the repo. Leave blank to show colored initials instead. |
   | `linkedin` | Full profile URL. Leave blank to hide the icon. |
   | `email` | Leave blank to hide the icon. |
   | `petal` | Optional: `red`, `orange`, `yellow`, `green`, `blue`, or `purple`. Leave blank to auto-assign in order. |
   | `department` | Advisor rows only — shown next to their role. |

   **Events tab:**

   | Column | Notes |
   | --- | --- |
   | `date` | ISO format `YYYY-MM-DD` (e.g. `2026-09-04`). Required — this is what sorts an event into Upcoming or Past automatically. |
   | `time` | Free text, e.g. `6:00 PM`. |
   | `title` | Event name. |
   | `location` | Room/building. |
   | `description` | One or two sentences. |
   | `link_url` | Optional — RSVP link, calendar link, or recap link. Leave blank to hide the button. |
   | `link_label` | Optional button text. Defaults to "Learn more" (upcoming) or "See recap" (past). |

2. For each tab: **File → Share → Publish to web** → select that sheet/tab → format **Comma-separated values (.csv)** → **Publish**. Copy the URL it gives you.
3. Open [assets/data/sheet-config.js](assets/data/sheet-config.js) and paste the two URLs in — that's the only file you need to edit, ever, for routine updates.
4. Push to `main`. The live site now reads from the Sheet on every page load — edit a cell, refresh the page, see the change. No commit needed for content changes, only for the one-time URL setup.

If a URL is left blank, or the Sheet is unreachable, the page quietly falls back to the placeholder cards already written into the HTML — nothing breaks, and that placeholder content also serves as a working example of the expected shape.

When in doubt, keep it warm, keep it Poppins-and-Inter, and keep white space and restraint doing most of the work — crimson and the spectrum colors are accents, not backgrounds.
