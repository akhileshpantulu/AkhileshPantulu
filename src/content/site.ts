/**
 * All site content lives in this file. Edit it and the whole site updates.
 *
 * The site is a set of "rooms": full-screen scenes with beacons you click to
 * move between rooms or open a panel. Everything marked TODO is placeholder.
 */

export const site = {
  name: "Akhilesh Pantulu",
  url: "https://akhileshpantulu.com", // TODO: your domain
  description: "Akhilesh Pantulu's portfolio of analytics and machine learning projects.",

  links: {
    github: "https://github.com/akhileshpantulu",
    linkedin: "https://www.linkedin.com/in/akhileshpantulu", // TODO: confirm handle
    email: "hello@example.com", // TODO: public contact email
    // Put your resume PDF in /public and set the path here, or leave null to hide it.
    resume: null as string | null, // e.g. "/Akhilesh-Pantulu-Resume.pdf"
  },
};

/* ------------------------------------------------------------------ */
/* Rooms                                                               */
/*                                                                     */
/* `scene` picks a built-in illustration (src/components/scenes.tsx).  */
/* Set `image` to a 16:9 photo in /public to use your own picture      */
/* instead, then move the beacons to match it.                         */
/*                                                                     */
/* Beacon x / y are percentages of the scene (0–100, from top-left).   */
/* `side: "left"` makes the label open toward the left (use it for     */
/* beacons near the right edge).                                       */
/* ------------------------------------------------------------------ */

export type Panel = "about" | "contact" | "stack";

export type BeaconAction =
  | { room: string } // go to another room
  | { panel: Panel } // open a drawer
  | { project: string } // open a project (by slug)
  | { url: string }; // external link

export type Beacon = {
  x: number;
  y: number;
  label: string;
  action: BeaconAction;
  side?: "left" | "right";
};

export type Room = {
  handle: string;
  title: string;
  scene: "front" | "studio" | "library";
  image?: string;
  // Optional credit tag shown at the bottom of the room (for artwork or photos).
  credit?: { title: string; artist: string; year: string; museum: string; url?: string };
  beacons: Beacon[];
};

export const rooms: Room[] = [
  {
    handle: "front",
    title: "Front",
    scene: "front",
    beacons: [
      { x: 30.6, y: 58.9, label: "Enter Studio", action: { room: "studio" } },
      { x: 39.4, y: 35.6, label: "Enter Library", action: { room: "library" } },
      { x: 68.8, y: 58.9, label: "Tech Stack", action: { panel: "stack" }, side: "left" },
      { x: 86.1, y: 63.9, label: "Get in Touch", action: { panel: "contact" }, side: "left" },
    ],
  },
  {
    handle: "studio",
    title: "Studio",
    scene: "studio",
    beacons: [
      { x: 34.1, y: 33.3, label: "Project One", action: { project: "project-one" } },
      { x: 44.7, y: 33.3, label: "Project Two", action: { project: "project-two" } },
      { x: 55.3, y: 33.3, label: "Project Three", action: { project: "project-three" } },
      { x: 65.9, y: 33.3, label: "Project Four", action: { project: "project-four" }, side: "left" },
      { x: 50, y: 55.6, label: "Tech Stack", action: { panel: "stack" } },
      { x: 84.7, y: 53.3, label: "Back to Front", action: { room: "front" }, side: "left" },
    ],
  },
  {
    handle: "library",
    title: "Library",
    scene: "library",
    beacons: [
      { x: 38.1, y: 68.9, label: "About Me", action: { panel: "about" } },
      { x: 14.4, y: 41.1, label: "Education", action: { panel: "about" } },
      { x: 50, y: 30, label: "Enter Studio", action: { room: "studio" } },
      { x: 84.7, y: 53.3, label: "Back to Front", action: { room: "front" }, side: "left" },
    ],
  },
];

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
    link: { label: "View the code", url: "https://github.com/akhileshpantulu" },
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
/* Tech stack. Shown as draggable icons in the "Tech Stack" drawer.    */
/* `icon` keys map to components in src/components/tech-icons.tsx.     */
/* ------------------------------------------------------------------ */

export const tech: { name: string; icon: string; color: string }[] = [
  { name: "python", icon: "python", color: "#3776AB" },
  { name: "sql", icon: "database", color: "#3f3f46" },
  { name: "r", icon: "r", color: "#276DC3" },
  { name: "pandas", icon: "pandas", color: "#E70488" },
  { name: "scikit-learn", icon: "sklearn", color: "#F7931E" },
  { name: "jupyter", icon: "jupyter", color: "#F37626" },
  { name: "snowflake", icon: "snowflake", color: "#29B5E8" },
  { name: "databricks", icon: "databricks", color: "#FF3621" },
  { name: "postgres", icon: "postgres", color: "#4169E1" },
  { name: "docker", icon: "docker", color: "#2496ED" },
  { name: "excel", icon: "excel", color: "#21A366" },
  { name: "power bi", icon: "bars", color: "#d4a800" },
  { name: "typescript", icon: "typescript", color: "#3178C6" },
  { name: "react", icon: "react", color: "#149eca" },
  { name: "next.js", icon: "next", color: "#111111" },
  { name: "claude", icon: "claude", color: "#D97757" },
];

/* ------------------------------------------------------------------ */
/* About and contact drawers                                           */
/* ------------------------------------------------------------------ */

export const about = {
  greeting: "Hi, I’m Akhilesh.",
  // TODO: two short paragraphs about what you do.
  paragraphs: [
    "Write a sentence or two about your current role and the kind of problems you work on.",
    "Then a sentence about the stack you use and what you build outside of work.",
  ],
  facts: [
    { label: "Education", value: "TODO: Degree, School (Year)" },
    { label: "Based", value: "TODO: City, State" },
    { label: "Focus", value: "Analytics · Data Science · ML" },
    { label: "Stack", value: "Python · SQL · TypeScript" },
  ],
};

export const contact = {
  blurb: "Happy to connect about projects, ideas, or interesting problems in AI, ML, and analytics.",
};
