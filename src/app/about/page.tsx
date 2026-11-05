import type { Metadata } from "next";
import { Experience } from "@/components/experience";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <Experience page="about" />;
}
