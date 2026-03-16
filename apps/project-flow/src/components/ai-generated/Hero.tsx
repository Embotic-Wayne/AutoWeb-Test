"use client";

import { useEffect, useState } from "react";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

type PersonaVariant = "teacher" | "student" | "default";

const PERSONA_CONTENT: Record<
  PersonaVariant,
  {
    badge: string;
    headline: string;
    subheadline: string;
    cta: string;
    ctaHref: string;
    proof: string;
  }
> = {
  default: {
    badge: "New courses available",
    headline: "Learn without limits, grow without boundaries.",
    subheadline:
      "Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.",
    cta: "Start learning free",
    ctaHref: "/signup",
    proof: "50,000+ students already enrolled",
  },
  teacher: {
    badge: "Built for educators",
    headline: "Empower your classroom with smarter tools",
    subheadline:
      "Automate grading, track progress, and focus on what matters \u2014 teaching.",
    cta: "Start Your Free Trial",
    ctaHref: "/signup?plan=educator",
    proof: "Trusted by 10,000+ educators worldwide",
  },
  student: {
    badge: "Made for students",
    headline: "Study smarter, not harder",
    subheadline:
      "AI-powered study plans, flashcards, and practice tests \u2014 all in one place.",
    cta: "Get Started Free",
    ctaHref: "/signup?plan=student",
    proof: "Join 50,000+ students already learning",
  },
};

export default function Hero() {
  const [persona, setPersona] = useState<PersonaVariant>("default");

  useEffect(() => {
    const personaEnabled =
      getCookie("autoweb-demo-persona-active") === "true";
    if (!personaEnabled) {
      setPersona("default");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source");
    if (utm === "canvas-lms") setPersona("teacher");
    else if (utm === "unidays") setPersona("student");
    else setPersona("default");
  }, []);

  const content = PERSONA_CONTENT[persona];

  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {content.badge}
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            {content.headline}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-neutral-500">
            {content.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={content.ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              {content.cta}
              <span>&rarr;</span>
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <span>&#9654;</span>
              Watch demo
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={i % 2 === 1 ? "/pfp1.jpeg" : "/pfp2.jpeg"}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">{content.proof}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
          <h3 className="text-lg font-bold text-neutral-900">
            Course Progress
          </h3>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2.5 flex-1 rounded-full bg-neutral-100">
              <div className="h-2.5 w-[85%] rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-medium text-green-600">+85%</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {["Mon", "Tue", "Wed"].map((day) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="h-20 w-full rounded-lg bg-neutral-100" />
                <span className="text-xs text-neutral-400">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
