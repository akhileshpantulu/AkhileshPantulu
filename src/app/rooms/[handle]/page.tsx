import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Experience } from "@/components/experience";
import { rooms } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return rooms.filter((r) => r.handle !== "front").map((r) => ({ handle: r.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const room = rooms.find((r) => r.handle === handle);
  return room ? { title: room.title } : {};
}

export default async function RoomPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  if (!rooms.some((r) => r.handle === handle)) notFound();
  return <Experience handle={handle} />;
}
