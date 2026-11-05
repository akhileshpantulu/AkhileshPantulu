# akhileshpantulu.com

Personal portfolio site. Next.js 16 (App Router, static export), Tailwind CSS v4, Geist fonts, and Motion for animation.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## Edit content

All copy, projects, and links live in **`src/content/site.ts`**. Anything marked `TODO` is placeholder text.

| Section | What to edit in `site.ts` |
| --- | --- |
| Header / hero | `site` (name, intro, links, resume path) |
| 01 Projects | `projects`: each one also gets a page at `/articles/<slug>` |
| 02 Tech | `tech`: icon keys map to `src/components/tech-icons.tsx` |
| 03 About | `about` |
| 04 Contact | `contact` |

**Resume:** drop a PDF in `public/` and set `site.links.resume` to its path, e.g. `"/Akhilesh-Pantulu-Resume.pdf"`. The resume buttons stay hidden while it's `null`.

**Card charts:** each project has a `preview` with one of five `kind`s, all animated on scroll:

- `leaderboard`: ranked rows with scores and bars
- `bars`: labeled metric bars with an optional footer
- `sparkline`: line/area chart over time
- `hbars`: horizontal bar comparison
- `columns`: vertical column chart

The types are in `src/components/previews.tsx`.

**Colors:** change the tokens at the top of `src/app/globals.css`. `--color-accent` re-skins the whole site.

## Layout

```
src/
  app/
    layout.tsx               fonts, metadata
    page.tsx                 homepage section order
    articles/[slug]/page.tsx project article pages
    not-found.tsx            404
    globals.css              tokens, glass cards, article typography
  components/
    nav.tsx                  sticky header, active-section highlight, scroll progress
    dot-grid.tsx             canvas background that lights up near the cursor
    previews.tsx             animated card charts
    tech-physics.tsx         drag-and-throw tech stack box
    ...
  content/site.ts            all content
```

## Deploy

**Vercel:** import the repo. It's detected as Next.js and needs no configuration.

**Any static host:** run `npm run build` and upload `out/`.
