import type { Metadata } from "next";
import { Experience } from "@/components/experience";

export const metadata: Metadata = { title: "Books" };

export default function BooksPage() {
  return <Experience page="books" />;
}
