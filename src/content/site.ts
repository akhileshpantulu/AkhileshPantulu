/**
 * All site content lives in this file. Edit it and the whole site updates.
 *
 * The homepage is a single artwork shown full-screen, with menus that open
 * side drawers for projects, about, and contact. Everything marked TODO is
 * placeholder.
 */

export const site = {
  name: "Akhilesh Pantulu",
  url: "https://akhileshpantulu.com", // TODO: your domain
  description: "Akhilesh Pantulu's portfolio of analytics and machine learning projects.",

  links: {
    linkedin: "https://www.linkedin.com/in/pantulu",
    email: "pantuluinvestments@gmail.com",
    // Put your resume PDF in /public and set the path here, or leave null to hide it.
    resume: null as string | null, // e.g. "/Akhilesh-Pantulu-Resume.pdf"
  },
};

/* ------------------------------------------------------------------ */
/* Homepage artwork. The image lives in /public and is always shown   */
/* whole (never cropped). The credit appears as a small tag below it.  */
/* ------------------------------------------------------------------ */

export type Credit = { title: string; artist: string; year: string; museum: string; url?: string };

export const home: { image: string; credit: Credit | null } = {
  image: "/Bradford.jpg",
  credit: { title: "Jungle Jungle", artist: "Mark Bradford", year: "2021", museum: "MoMA" },
};

/* Art gallery (/art). Shown one at a time, in this order. To add a piece,
   put the image in /public and add an entry with its credit. */
export const gallery: { image: string; credit: Credit | null }[] = [
  { image: "/Bradford.jpg", credit: { title: "Jungle Jungle", artist: "Mark Bradford", year: "2021", museum: "MoMA" } },
  { image: "/basquiat-bird-on-money.avif", credit: { title: "Bird on Money", artist: "Jean-Michel Basquiat", year: "1981", museum: "Rubell Family Collection" } },
  { image: "/cole-the-oxbow.jpg", credit: { title: "The Oxbow", artist: "Thomas Cole", year: "1836", museum: "The Metropolitan Museum of Art" } },
  { image: "/david-death-of-socrates.jpg", credit: { title: "The Death of Socrates", artist: "Jacques-Louis David", year: "1787", museum: "The Metropolitan Museum of Art" } },
  { image: "/picasso-guernica.webp", credit: { title: "Guernica", artist: "Pablo Picasso", year: "1937", museum: "Museo Reina Sofía" } },
  { image: "/pollock-number-14.jpg", credit: { title: "Number 14", artist: "Jackson Pollock", year: "1951", museum: "Tate" } },
  { image: "/lawrence-migration-series-1.jpg", credit: { title: "The Migration Series, Panel 1", artist: "Jacob Lawrence", year: "1941", museum: "The Phillips Collection" } },
];

/* Artwork for the About and Books pages, shown full-screen with the text
   over it. Leave a page empty to reuse the homepage artwork. TODO: pick art. */
export const pageArt: Record<"about" | "books", { image?: string; credit?: Credit | null }> = {
  about: {}, // e.g. { image: "/my-art.jpg", credit: { title: "", artist: "", year: "", museum: "" } }
  books: {},
};

/* ------------------------------------------------------------------ */
/* Projects. Each opens in the side drawer and has a full write-up at  */
/* /articles/<slug>.                                                   */
/* ------------------------------------------------------------------ */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }
  | { type: "quote"; text: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  date: string; // ISO date, e.g. "2026-06-12"
  topics: string;
  stack: string[];
  body: ArticleBlock[];
  link?: { label: string; url: string }; // optional repo / demo link
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One",
    summary:
      "Two or three sentences on the question, the data, and the answer. Write it so someone skimming knows the result without clicking.",
    date: "2026-10-01",
    topics: "Topic · Method · Tool",
    stack: ["python", "pandas", "sklearn"],
    body: [
      { type: "p", text: "TODO: Open with the question and why it matters." },
      { type: "h2", text: "Data" },
      { type: "p", text: "Where the data came from, how much of it there is, and how it was cleaned." },
      { type: "h2", text: "Method" },
      { type: "list", items: ["Step one", "Step two", "Step three"] },
      { type: "code", text: "import pandas as pd\n\ndf = pd.read_parquet('data.parquet')" },
      { type: "h2", text: "Results" },
      { type: "p", text: "State the result plainly, with numbers." },
    ],
  },
  {
    slug: "project-two",
    title: "Project Two",
    summary: "A short description of a second project. Lead with the number that matters and one surprising detail.",
    date: "2026-08-15",
    topics: "NLP · Classification",
    stack: ["python", "sklearn", "nlp"],
    body: [{ type: "p", text: "TODO: Write the article." }],
  },
  {
    slug: "project-three",
    title: "Project Three",
    summary: "Explain the before and after, and what changed because of the work.",
    date: "2026-06-12",
    topics: "Pipelines · SQL",
    stack: ["python", "duckdb"],
    body: [{ type: "p", text: "TODO: Write the article." }],
  },
  {
    slug: "project-four",
    title: "Project Four",
    summary: "One more project. Add or remove entries freely; the Projects menu lists all of them.",
    date: "2026-03-02",
    topics: "Forecasting",
    stack: ["r", "sql"],
    body: [{ type: "p", text: "TODO: Write the article." }],
  },
];

/* ------------------------------------------------------------------ */
/* About and contact drawers                                           */
/* ------------------------------------------------------------------ */

export const about = {
  paragraphs: [
    "Investment professional based in London. This website serves as a collection of my more esoteric interests, and AI application projects.",
  ],
};


/* Books: shown in About → Books. */
export const books: {
  title: string;
  subtitle?: string;
  author: string;
  note?: string;
  url?: string;
  cover?: string; // image in /public, e.g. "/roll-the-calls.jpg" (hidden if the file is missing)
}[] = [
  {
    title: "Roll the Calls",
    subtitle: "A Memoir",
    author: "Ari Emanuel",
    cover: "/roll-the-calls.jpg",
  },
  {
    title: "The Caesars Palace Coup",
    subtitle: "How a Billionaire Brawl Over the Famous Casino Exposed the Power and Greed of Wall Street",
    author: "Sujeet Indap and Max Frumes",
    cover: "/caesars-palace-coup.jpg",
  },
];
/* Misc: shown in About → Misc. Anything else: interests, links, notes. TODO. */
export const misc: { title: string; text: string; url?: string }[] = [
  { title: "Something I'm into", text: "A sentence or two about it." },
  { title: "Something I'm working on", text: "A sentence or two about it." },
];
