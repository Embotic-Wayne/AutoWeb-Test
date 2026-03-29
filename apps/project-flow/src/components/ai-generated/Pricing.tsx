export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Pricing Plans</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">Choose the plan that fits your learning goals</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-left">
            <div className="flex items-center gap-2 mb-6">
              <span className="rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">Most Popular</span>
              <div className="flex flex-col items-start">
                <div className="text-3xl font-bold text-neutral-900">$299</div>
                <div className="text-sm text-neutral-500">per year</div>
              </div>
            </div>
            <ul className="mt-6 mb-8 list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Unlimited Courses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Certificates Included</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Priority Support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Exclusive Workshops</span>
              </li>
            </ul>
            <button className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Get Started
            </button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-left">
            <h3 className="mt-6 text-xl font-bold text-neutral-900">Basic</h3>
            <div className="flex items-center gap-2 mb-6">
              <span className="rounded-full px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600">Basic</span>
              <div className="text-3xl font-bold text-neutral-900">$99</div>
              <div className="text-sm text-neutral-500">per year</div>
            </div>
            <ul className="mt-6 mb-8 list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Access to Core Content</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Community Access</span>
              </li>
            </ul>
            <button className="rounded-full border border-neutral-900 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              Enroll
            </button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-left">
            <h3 className="mt-6 text-xl font-bold text-neutral-900">Pro</h3>
            <div className="flex items-center gap-2 mb-6">
              <span className="rounded-full px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600">Pro</span>
              <div className="text-3xl font-bold text-neutral-900">$199</div>
              <div className="text-sm text-neutral-500">per year</div>
            </div>
            <ul className="mt-6 mb-8 list-none space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">All Access</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Live Sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-500">Mobile App</span>
              </li>
            </ul>
            <button className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Enroll
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
