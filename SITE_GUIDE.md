# akhileshpantulu.com

Personal portfolio site. The homepage is a single artwork shown full-screen with a small credit tag; minimal menus list projects, about pages, and contact links. Built with Next.js 16 (App Router, static export) and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## How it's laid out

- **Splash:** your name types out on a white screen, then fades into the site. It plays every time the site is opened (including a refresh), but never when moving between pages or opening a page from a link on the site (see `src/components/splash.tsx`).
- **Homepage:** the artwork, always shown whole (never cropped) on any screen size, with its credit centered below.
- **Header:** your name centered. Projects and About top-left each slide in a list from the left (About lists About / Misc). Contact top-right drops a short list of links. On phones it collapses to Menu and Contact buttons at the bottom.
- **About page** (`/about`): its own artwork, full-screen, with the text in a dark frosted panel down the full left side. Clicking outside it, pressing Escape, or "Hide" tucks it away to show the whole piece.
- **Books and Art** are switched off for now. Their content (`books`, `gallery` in `site.ts`) and page code are kept; restore the menu links in `src/components/experience.tsx` and the pages in `src/app/books` and `src/app/art` to turn them back on.
- **Drawers:** each project and Misc slide in from the right.
- **Articles:** every project has a full write-up at `/articles/<slug>`.

## Edit content

Everything is in **`src/content/site.ts`**. Anything marked `TODO` is placeholder text.

| What | Where in `site.ts` |
| --- | --- |
| Name, links, resume | `site` |
| Homepage image and credit | `home` |
| Projects and write-ups | `projects` |
| About / Misc | `about`, `misc` |
| Art for the About page | `pageArt` (falls back to the homepage art) |
| Books and Art gallery (switched off) | `books`, `gallery` |

**Changing the artwork:** put the image in `public/`, then set `home.image` to its path (e.g. `"/my-image.jpg"`) and update `home.credit`. Add `url` to the credit to make it a link.

**Resume:** drop a PDF in `public/` and set `site.links.resume`. It then appears in the Contact links.

## Deploy

**Vercel:** import the repo. It's detected as Next.js and needs no configuration.

**Any static host:** run `npm run build` and upload `out/`.
