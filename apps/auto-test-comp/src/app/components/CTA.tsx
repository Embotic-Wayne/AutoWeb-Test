"use client";

import Link from "next/link";

function ArrowRightIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function CTA() {
  return (
    <section className="bg-blue-700 py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Ready to start your learning journey?
        </h2>
        <p className="mb-10 text-lg text-blue-200">
          Join thousands of learners who are already transforming their careers. Start with a free trial and experience the difference.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
          >
            Get started for free
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-400 bg-transparent px-5 py-3 text-sm font-medium text-white transition hover:border-blue-300 hover:bg-blue-600"
          >
            Talk to sales
          </Link>
        </div>
      </div>
    </section>
  );
}
