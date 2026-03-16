"use client";

import Link from "next/link";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For individuals exploring AI capabilities.",
    features: [
      "100 AI generations per month",
      "Basic model access",
      "Community support",
      "Standard response time",
    ],
    cta: "Get Started",
    ctaHref: "/signup",
    recommended: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals who need more power.",
    features: [
      "Unlimited AI generations",
      "Advanced model access",
      "Priority support",
      "Custom AI training",
      "API access",
    ],
    cta: "Upgrade to Pro",
    ctaHref: "/signup?plan=pro",
    recommended: false,
  },
  {
    name: "Team",
    price: "$49",
    period: "/user/month",
    description: "For teams building the future together.",
    features: [
      "Everything in Pro",
      "Team collaboration tools",
      "Shared workspaces",
      "Admin dashboard",
      "Centralized billing",
      "SSO authentication",
    ],
    cta: "Start a Team plan",
    ctaHref: "/signup?plan=team",
    recommended: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-blue-100 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-sm text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            New: Usage-Based Pricing
          </span>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Plans and Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Get started immediately for free. Upgrade for more power, usage, and
            collaboration.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-6 shadow-sm transition hover:shadow-md ${
                plan.recommended
                  ? "border-blue-500 bg-white"
                  : "border-neutral-200 bg-white"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Recommended
                </span>
              )}
              <h3 className="mb-2 text-xl font-bold text-neutral-900">
                {plan.name}
              </h3>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-900">
                  {plan.price}
                </span>
                <span className="text-neutral-500">{plan.period}</span>
              </div>
              <p className="mb-6 text-sm text-neutral-600">{plan.description}</p>
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-neutral-700"
                  >
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.ctaHref}
                className={`block rounded-lg px-4 py-3 text-center text-sm font-medium transition ${
                  plan.recommended
                    ? "border-2 border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
