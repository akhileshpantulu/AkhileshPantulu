import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white">
      <h1 className="text-5xl font-bold">This room is locked.</h1>
      <p className="text-neutral-400">The page you tried doesn&apos;t exist.</p>
      <Link href="/" className="h-9 border border-neutral-300 px-3 font-bold leading-9 text-neutral-300 hover:bg-white hover:text-black">
        Back to the front
      </Link>
    </main>
  );
}
