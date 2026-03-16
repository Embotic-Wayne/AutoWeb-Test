export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/mo",
      popular: false,
      features: [
        "Access to all beginner courses",
        "Hands-on projects",
        "Community forum access",
        "Weekly webinars",
      ],
      cta: "Select",
    },
    {
      name: "Pro",
      price: "$49",
      period: "/mo",
      popular: true,
      features: [
        "All Basic features",
        "Advanced courses",
        "Live mentorship sessions",
        "Project feedback",
        "Certificate of completion",
      ],
      cta: "Select",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      popular: false,
      features: [
        "All Pro features",
        "Dedicated account manager",
        "On-site training",
        "Custom curriculum",
        "Priority support",
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
          Choose the plan that fits you
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">
          Flexible pricing for individuals, teams, and organizations
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-8 text-left ${
                p.popular
                  ? "border-neutral-900 shadow-lg"
                  : "border-neutral-200"
              }`}
            >
              {p.popular && (
                <span className="mb-4 inline-block rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-neutral-900">
                {p.name}
              </h3>
              <div className="mt-3 text-3xl font-bold text-neutral-900">
                {p.price}
                <span className="text-sm font-normal text-neutral-400">
                  {p.period}
                </span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-neutral-600">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-green-500">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className={`mt-8 block w-full rounded-full py-2.5 text-center text-sm font-medium transition-colors ${
                  p.popular
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
