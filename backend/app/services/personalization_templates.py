"""
Generate personalization file contents (middleware, persona config, Hero component).
Pure Python — no LLM calls.
"""

MIDDLEWARE_PATH = "apps/project-flow/src/middleware.ts"
PERSONA_CONFIG_PATH = "apps/project-flow/src/config/persona-config.ts"
HERO_PATH = "apps/project-flow/src/components/ai-generated/Hero.tsx"

# The original default Hero.tsx content — used by reset.
DEFAULT_HERO_TSX = '''\
export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            New courses available
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            Learn without limits, grow without boundaries.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-neutral-500">
            Access world-class education from top instructors. Master new
            skills, advance your career, and unlock your potential with our
            interactive learning platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              Start learning free
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
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-white bg-neutral-200"
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              50,000+ students already enrolled
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
          <h3 className="text-lg font-bold text-neutral-900">Course Progress</h3>
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
'''


def _build_middleware(personas: list[dict]) -> str:
    """Generate Next.js middleware that reads utm_source and sets a persona cookie."""
    # Build the utm-to-persona lookup
    entries = []
    for p in personas:
        entries.append(f'  "{p["utm_source"]}": "{p["key"]}",')
    lookup_body = "\n".join(entries)

    return f'''\
import {{ NextRequest, NextResponse }} from "next/server";

const utmToPersona: Record<string, string> = {{
{lookup_body}
}};

export function middleware(request: NextRequest) {{
  const utm = request.nextUrl.searchParams.get("utm_source");
  const response = NextResponse.next();

  if (utm && utmToPersona[utm]) {{
    response.cookies.set("persona", utmToPersona[utm], {{
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
    }});
  }}

  return response;
}}

export const config = {{
  matcher: ["/"],
}};
'''


def _build_persona_config(personas: list[dict], default: dict) -> str:
    """Generate the persona-config.ts data file."""
    lines = [
        'export interface PersonaContent {',
        '  headline: string;',
        '  subheadline: string;',
        '  cta: string;',
        '  ctaHref: string;',
        '}',
        '',
        'export const personaConfig: Record<string, PersonaContent> = {',
    ]

    # Default entry
    lines.append('  default: {')
    lines.append(f'    headline: "{default["headline"]}",')
    lines.append(f'    subheadline: "{default["subheadline"]}",')
    lines.append(f'    cta: "{default["cta"]}",')
    lines.append(f'    ctaHref: "{default.get("ctaHref", "/signup")}",')
    lines.append('  },')

    # Persona entries
    for p in personas:
        lines.append(f'  {p["key"]}: {{')
        lines.append(f'    headline: "{p["headline"]}",')
        lines.append(f'    subheadline: "{p["subheadline"]}",')
        lines.append(f'    cta: "{p["cta"]}",')
        lines.append(f'    ctaHref: "{p.get("ctaHref", "/signup")}",')
        lines.append('  },')

    lines.append('};')
    lines.append('')

    # UTM mapping
    utm_entries = []
    for p in personas:
        utm_entries.append(f'  "{p["utm_source"]}": "{p["key"]}",')

    lines.append('export const utmToPersona: Record<string, string> = {')
    lines.extend(utm_entries)
    lines.append('};')
    lines.append('')

    return "\n".join(lines)


def _build_hero(personas: list[dict], default: dict) -> str:
    """Generate the persona-aware Hero.tsx client component."""
    return '''\
"use client";

import { useEffect, useState } from "react";
import { personaConfig } from "@/config/persona-config";

function getPersonaCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\\s*)persona=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function Hero() {
  const [personaKey, setPersonaKey] = useState<string>("default");

  useEffect(() => {
    const key = getPersonaCookie();
    if (key && personaConfig[key]) {
      setPersonaKey(key);
    }
  }, []);

  const content = personaConfig[personaKey] ?? personaConfig["default"];

  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            New courses available
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
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-white bg-neutral-200"
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              50,000+ students already enrolled
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
          <h3 className="text-lg font-bold text-neutral-900">Course Progress</h3>
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
'''


def generate_personalization_files(
    personas: list[dict], default: dict
) -> dict[str, str]:
    """
    Generate the 3 personalization files.
    Returns {full_repo_path: file_content}.
    """
    return {
        MIDDLEWARE_PATH: _build_middleware(personas),
        PERSONA_CONFIG_PATH: _build_persona_config(personas, default),
        HERO_PATH: _build_hero(personas, default),
    }
