# akhileshpantulu.com

Personal portfolio site built as a set of explorable rooms. Each room is a full-screen scene with beacons that move you to another room or open a panel. Built with Next.js 16 (App Router, static export) and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # writes the static site to ./out
```

## How it's laid out

- **Loader:** a white screen with your name, shown once per browser session.
- **Rooms:** `/` (Front), `/rooms/studio`, `/rooms/library`. Each scene blurs in on arrival. On phones the room is wider than the screen and can be swiped sideways.
- **Header:** your name centered; Projects / Stack / About top-left, Contact top-right, Explore (room list) bottom-left, ® (links) bottom-right. On phones it collapses to Menu and Contact buttons at the bottom.
- **Drawers:** About, Contact, Tech Stack (draggable icons), and each project slide in from the right.
- **Articles:** every project has a full write-up at `/articles/<slug>`.

## Edit content

Everything is in **`src/content/site.ts`**. Anything marked `TODO` is placeholder text.

| What | Where in `site.ts` |
| --- | --- |
| Name, links, resume | `site` |
| Rooms and their beacons | `rooms` |
| Projects and write-ups | `projects` |
| Tech stack icons | `tech` (icon keys map to `src/components/tech-icons.tsx`) |
| About / contact text | `about`, `contact` |

**Beacons:** each has `x` / `y` as percentages of the scene, a `label`, and an `action`:

- `{ room: "studio" }`: go to another room
- `{ panel: "about" | "contact" | "stack" }`: open a drawer
- `{ project: "project-one" }`: open a project
- `{ url: "https://..." }`: external link

Use `side: "left"` on beacons near the right edge so their label opens leftward.

**Using your own photos:** the rooms are SVG illustrations in `src/components/scenes.tsx`. To use a real photo, put a 16:9 image in `public/` and set `image: "/my-room.jpg"` on the room, then adjust the beacon positions to match.

**Adding a room:** add an entry to `rooms` with an `image` (or a new scene in `scenes.tsx`). It's picked up by the Explore menu and gets a page at `/rooms/<handle>`.

**Resume:** drop a PDF in `public/` and set `site.links.resume`. It then appears in the ® menu and the Contact drawer.

## Deploy

**Vercel:** import the repo. It's detected as Next.js and needs no configuration.

**Any static host:** run `npm run build` and upload `out/`.
