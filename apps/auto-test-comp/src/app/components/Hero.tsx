"use client";

import Link from "next/link";

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

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

export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center md:justify-between md:py-24">
        <div className="flex-1">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3.5 py-1.5 text-sm text-neutral-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            New courses available
          </div>
          <h1 className="mb-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-5xl">
            Learn without limits, grow without boundaries.
          </h1>
          <p className="mb-8 max-w-lg text-lg text-neutral-600">
            Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.
          </p>
          <div className="mb-10 flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Start learning free
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
            >
              <PlayIcon className="h-4 w-4" />
              Watch demo
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-white bg-neutral-200"
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-sm font-medium text-neutral-700">
              50,000+ students already enrolled
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 md:w-80 lg:w-96">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-6 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-neutral-900">
              Course Progress
            </h3>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: "85%" }}
                />
              </div>
              <span className="text-sm font-medium text-emerald-600">+85%</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Mon", "Tue", "Wed"].map((day) => (
                <div key={day}>
                  <div
                    className="h-16 rounded-lg bg-neutral-200/80"
                    aria-hidden
                  />
                  <p className="mt-1.5 text-center text-xs text-neutral-500">
                    {day}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
