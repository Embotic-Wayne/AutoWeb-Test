export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Flexible pricing for individuals, teams, and organizations</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">Choose the plan that fits you</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-left">
            <h3 className="text-xl font-semibold text-neutral-900">Basic</h3>
            <p className="mt-2 text-2xl font-bold text-neutral-900">$29/mo</p>
            <ul className="mt-6 list-none space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Access to all beginner courses
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Hands-on projects
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Community forum access
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Weekly webinars
                </span>
              </li>
            </ul>
            <button className="mt-8 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors">Select</button>
          </div>
          <div className="rounded-2xl border border-neutral-900 shadow-lg bg-white p-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full px-3 py-1 text-xs bg-neutral-50 text-neutral-600">Most Popular</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">Pro</h3>
            <p className="mt-2 text-2xl font-bold text-neutral-900">$49/mo</p>
            <ul className="mt-6 list-none space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  All Basic features
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Advanced courses
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Live mentorship sessions
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Project feedback
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Certificate of completion
                </span>
              </li>
            </ul>
            <button className="mt-8 rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors">Select</button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-left">
            <h3 className="text-xl font-semibold text-neutral-900">Enterprise</h3>
            <p className="mt-2 text-2xl font-bold text-neutral-900">Custom</p>
            <ul className="mt-6 list-none space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  All Pro features
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Dedicated account manager
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  On-site training
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Custom curriculum
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
                  Priority support
                </span>
              </li>
            </ul>
            <button className="mt-8 rounded-full border border-neutral-900 px-6 py-2.5 text-xs font-medium text-neutral-900 hover:bg-neutral-50 transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}
