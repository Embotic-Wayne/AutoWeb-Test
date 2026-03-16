"use client";

import Link from "next/link";

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

const platformLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Courses", href: "#courses" },
  { label: "Enterprise", href: "/enterprise" },
];

const resourcesLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Documentation", href: "/docs" },
  { label: "Help Center", href: "/help" },
  { label: "Community", href: "/community" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-blue-100 bg-blue-50/50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 font-bold text-blue-700"
            >
              <GraduationCapIcon className="h-7 w-7" />
              Knowledgeable
            </Link>
            <p className="max-w-sm text-sm text-neutral-600">
              Empowering learners worldwide with accessible, high-quality education. Start your journey today.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-neutral-900">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-600 hover:text-blue-700"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-neutral-900">Resources</h4>
            <ul className="space-y-3">
              {resourcesLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-600 hover:text-blue-700"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-neutral-900">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-neutral-600 hover:text-blue-700"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="mb-3 font-semibold text-neutral-900">Legal</h4>
              <Link
                href="/privacy"
                className="text-sm text-neutral-600 hover:text-blue-700"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
