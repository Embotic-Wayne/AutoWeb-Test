"use client";

import Link from "next/link";
import { useViewMode } from "../context/ViewModeContext";

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

export default function Header() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-neutral-900">
          <GraduationCapIcon className="h-7 w-7" />
          Learnify
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#courses" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Courses
          </Link>
          <Link href="#features" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Pricing
          </Link>
          <Link href="#about" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            About
          </Link>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            role="group"
            aria-label="View mode"
            className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5"
          >
            <button
              type="button"
              onClick={() => setViewMode("simple")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                viewMode === "simple"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Before
            </button>
            <button
              type="button"
              onClick={() => setViewMode("advanced")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:px-3 sm:text-sm ${
                viewMode === "advanced"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              After
            </button>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
