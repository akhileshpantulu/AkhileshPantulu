import type { Metadata } from "next";
import { Experience } from "@/components/experience";

export const metadata: Metadata = { title: "Art" };

export default function ArtPage() {
  return <Experience page="art" />;
}
