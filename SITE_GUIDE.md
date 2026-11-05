# akhileshpantulu.com

Personal portfolio site. The homepage is a single artwork shown full-screen with a small credit tag; minimal menus list projects, about pages, and contact links. Built with Next.js 16 (App Router, static export) and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## How it's laid out

- **Loader:** a white screen with your name, shown once per browser session. The artwork then blurs in.
- **Homepage:** the artwork, always shown whole (never cropped) on any screen size, with its credit centered below.
- **Header:** your name centered. Projects and About top-left each slide in a list from the left (About lists About / Books / Art / Misc). Contact top-right drops a short list of links. On phones it collapses to Menu and Contact buttons at the bottom.
- **About and Books pages** (`/about`, `/books`): their own artwork, full-screen, with the text in a dark frosted panel down the full left side. Clicking outside it, pressing Escape, or "Hide" tucks it away to show the whole piece.
- **Art page** (`/art`): a gallery shown one piece at a time like the homepage. Click the left or right half of the screen (the cursor becomes an arrow), use Previous / Next or the arrow keys, or swipe on phones.
- **Drawers:** each project and Misc slide in from the right.
- **Articles:** every project has a full write-up at `/articles/<slug>`.

## Edit content

Everything is in **`src/content/site.ts`**. Anything marked `TODO` is placeholder text.

| What | Where in `site.ts` |
| --- | --- |
| Name, links, resume | `site` |
| Homepage image and credit | `home` |
| Projects and write-ups | `projects` |
| About / Books / Misc | `about`, `books`, `misc` |
| Art for About / Books | `pageArt` (falls back to the homepage art) |
| Art gallery | `gallery` |

**Changing the artwork:** put the image in `public/`, then set `home.image` to its path (e.g. `"/my-image.jpg"`) and update `home.credit`. Add `url` to the credit to make it a link.

**Resume:** drop a PDF in `public/` and set `site.links.resume`. It then appears in the Contact links.

## Deploy

**Vercel:** import the repo. It's detected as Next.js and needs no configuration.

**Any static host:** run `npm run build` and upload `out/`.
