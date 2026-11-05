/**
 * All site content lives in this file. Edit it and the whole site updates.
 *
 * Everything marked TODO is placeholder copy: replace it with your own
 * details, projects, and articles before deploying.
 */

import type { Preview } from "@/components/previews";

export const site = {
  name: "Akhilesh Pantulu",
  // TODO: one-sentence intro under your name.
  intro: "Building data products, models, and tools that make decisions easier.",
  url: "https://akhileshpantulu.com", // TODO: your domain
  description: "Akhilesh Pantulu's portfolio of analytics and machine learning projects.",
  version: "v0.1.0",

  links: {
    github: "https://github.com/akhileshpantulu",
    linkedin: "https://www.linkedin.com/in/akhileshpantulu", // TODO: confirm handle
    linkedinLabel: "in/akhileshpantulu",
    githubLabel: "@akhileshpantulu",
    email: "hello@example.com", // TODO: public contact email
    // Put your resume PDF in /public and set the path here, or set to null to hide the button.
    resume: null as string | null, // e.g. "/Akhilesh-Pantulu-Resume.pdf"
  },
};

/* ------------------------------------------------------------------ */
/* 01 · Projects / articles. Each one gets its own page at             */
/* /articles/<slug>. The first `projectsVisible` are shown; the rest   */
/* sit behind a "View N more" button.                                  */
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
  topics: string; // shown in accent on the card, e.g. "NLP · SEC · 10-K"
  stack: string[];
  preview: Preview;
  body: ArticleBlock[];
  link?: { label: string; url: string }; // optional repo / demo link on the article page
};

export const projectsVisible = 3;

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project One: A Headline That States the Finding",
    summary:
      "Two or three sentences on the question, the data, and the answer. Write it so someone skimming the page knows the result without clicking.",
    date: "2026-10-01",
    topics: "Topic · Method · Tool",
    stack: ["python", "pandas", "sklearn"],
    preview: {
      kind: "sparkline",
      title: "Metric over time",
      points: [11, 12, 12, 12, 13, 13, 13, 14, 18, 20, 21, 21, 21.5, 22],
      startLabel: "2013",
      endLabel: "2026",
      yLabel: "RATE %",
      suffix: "%",
    },
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
    link: { label: "view the code", url: "https://github.com/akhileshpantulu" },
  },
  {
    slug: "project-two",
    title: "Project Two: What the Model Caught",
    summary:
      "A short description of a second project. Lead with the number that matters and one surprising detail.",
    date: "2026-08-15",
    topics: "NLP · Classification",
    stack: ["python", "sklearn", "nlp"],
    preview: {
      kind: "hbars",
      title: "PRECISION → HORIZON",
      rows: [
        { label: "in-sample", value: 46 },
        { label: "+ feature A", value: 61 },
        { label: "+ feature B", value: 69 },
      ],
      suffix: "%",
    },
    body: [
      { type: "p", text: "TODO: Write the article." },
    ],
  },
  {
    slug: "project-three",
    title: "Project Three: Reducing Something by a Lot",
    summary: "Explain the before and after. Charts on the card show the headline result.",
    date: "2026-06-12",
    topics: "Privacy · Pipelines",
    stack: ["python", "duckdb"],
    preview: {
      kind: "columns",
      title: "UNIQUE %",
      columns: [
        { label: "RAW", value: 90, showValue: true },
        { label: "×15", value: 42 },
        { label: "×60", value: 12 },
        { label: "AGG", value: 0.06, showValue: true },
      ],
      suffix: "%",
    },
    body: [{ type: "p", text: "TODO: Write the article." }],
  },
  {
    slug: "project-four",
    title: "Project Four: Hidden Until Expanded",
    summary: "Projects past the first three are tucked behind the “View more” button.",
    date: "2026-03-02",
    topics: "Forecasting",
    stack: ["r", "sql"],
    preview: {
      kind: "sparkline",
      title: "Forecast vs actual",
      points: [40, 42, 39, 45, 47, 50, 49, 53, 57, 56, 60],
      startLabel: "JAN",
      endLabel: "NOV",
      yLabel: "UNITS",
    },
    body: [{ type: "p", text: "TODO: Write the article." }],
  },
];

/* ------------------------------------------------------------------ */
/* 02 · Tech stack. Icons are draggable in a little physics box.       */
/* `icon` keys map to components in src/components/tech-icons.tsx.     */
/* ------------------------------------------------------------------ */

export const tech: { name: string; icon: string; color: string }[] = [
  { name: "python", icon: "python", color: "#3776AB" },
  { name: "sql", icon: "database", color: "#EBE9E3" },
  { name: "r", icon: "r", color: "#276DC3" },
  { name: "pandas", icon: "pandas", color: "#E70488" },
  { name: "scikit-learn", icon: "sklearn", color: "#F7931E" },
  { name: "jupyter", icon: "jupyter", color: "#F37626" },
  { name: "snowflake", icon: "snowflake", color: "#29B5E8" },
  { name: "databricks", icon: "databricks", color: "#FF3621" },
  { name: "postgres", icon: "postgres", color: "#4169E1" },
  { name: "docker", icon: "docker", color: "#2496ED" },
  { name: "excel", icon: "excel", color: "#21A366" },
  { name: "power bi", icon: "bars", color: "#F2C811" },
  { name: "typescript", icon: "typescript", color: "#3178C6" },
  { name: "react", icon: "react", color: "#61DAFB" },
  { name: "next.js", icon: "next", color: "#EBE9E3" },
  { name: "claude", icon: "claude", color: "#D97757" },
];

/* ------------------------------------------------------------------ */
/* 03 · About                                                          */
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

/* ------------------------------------------------------------------ */
/* 04 · Contact                                                        */
/* ------------------------------------------------------------------ */

export const contact = {
  headline: "Always up for the next",
  headlineAccent: "problem worth solving.",
  blurb: "Happy to connect about projects, ideas, or interesting problems in AI, ML, and analytics.",
};

/* Navigation. Order and labels for the header; ids must match sections. */
export const nav = [
  { id: "projects", label: "projects" },
  { id: "tech", label: "tech" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
];
