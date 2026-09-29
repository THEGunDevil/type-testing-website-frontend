"use client";

import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-900 font-jetbrains text-gray-400">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-6 md:flex-row">
        {/* Brand */}
        <div className="text-sm">
          <span className="font-bold text-amber-700">TypeType</span>
          <span className="mx-2 text-gray-600">•</span>
          <span>Type. Practice. Improve.</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="transition-colors hover:text-amber-500">
            Challenge
          </Link>

          <Link
            href="/practice"
            className="transition-colors hover:text-amber-500"
          >
            Practice
          </Link>

          <Link
            href="https://himel-codes-95.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="portfolio"
            className="transition-colors hover:text-amber-500"
          >
            <BriefcaseBusiness size={18} />
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} TypeType
        </p>
      </div>
    </footer>
  );
}

export default Footer;
