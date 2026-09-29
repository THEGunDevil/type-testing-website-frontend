"use client"
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-800 px-5 font-jetbrains text-gray-200">
      <section className="text-center">
        <p className="text-8xl font-bold text-amber-700">404</p>

        <h1 className="mt-4 text-3xl font-bold">
          Page Not Found
        </h1>

        <p className="mt-3 text-gray-400">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-amber-700 px-6 py-3 font-bold text-gray-900 transition-colors hover:bg-amber-600"
        >
          Go Home
        </Link>
      </section>
    </main>
  );
}
