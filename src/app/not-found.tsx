import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | AMSIO International",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a1628] text-white px-4">
      <p className="text-amber-400 font-semibold tracking-widest text-sm mb-4 uppercase">
        Error 404
      </p>
      <h1 className="text-5xl font-bold mb-4 text-white">Page Not Found</h1>
      <p className="text-gray-400 text-lg mb-8 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-400 text-[#0a1628] font-semibold hover:bg-amber-300 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
