# akhileshpantulu.com

Personal portfolio site. The homepage is a single artwork shown full-screen with a small credit tag; minimal menus open side drawers for projects, about, and contact. Built with Next.js 16 (App Router, static export) and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## How it's laid out

- **Loader:** a white screen with your name, shown once per browser session. The artwork then blurs in.
- **Homepage:** the artwork, always shown whole (never cropped) on any screen size, with its credit centered below.
- **Header:** your name centered, Projects / About top-left, Contact top-right, ® (links) bottom-right. On phones it collapses to Menu and Contact buttons at the bottom.
- **Drawers:** About, Contact, and each project slide in from the right.
- **Articles:** every project has a full write-up at `/articles/<slug>`.

## Edit content

Everything is in **`src/content/site.ts`**. Anything marked `TODO` is placeholder text.

| What | Where in `site.ts` |
| --- | --- |
| Name, links, resume | `site` |
| Homepage image and credit | `home` |
| Projects and write-ups | `projects` |
| About / contact text | `about`, `contact` |

**Changing the artwork:** put the image in `public/`, then set `home.image` to its path (e.g. `"/my-image.jpg"`) and update `home.credit`. Add `url` to the credit to make it a link.

**Resume:** drop a PDF in `public/` and set `site.links.resume`. It then appears in the ® menu and the Contact drawer.

## Deploy

**Vercel:** import the repo. It's detected as Next.js and needs no configuration.

**Any static host:** run `npm run build` and upload `out/`.
