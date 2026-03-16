export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Course Pricing</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">Choose the plan that fits your learning goals</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <div className="flex flex-col items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">Basic</h3>
              <p className="text-neutral-500">Foundational Access</p>
            </div>
            <ul className="mt-6 flex flex-col space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">Unlimited Course Access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">Downloadable Materials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">Community Support</span>
              </li>
            </ul>
            <div className="flex flex-col items-center justify-between mb-6">
              <p className="text-neutral-500 text-sm">Most Popular</p>
              <p className="text-3xl font-bold text-neutral-900">$29/mo</p>
            </div>
            <button className="mt-6 rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Select Plan</button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <div className="flex flex-col items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">Standard</h3>
              <p className="text-neutral-500">Advanced Learning</p>
            </div>
            <ul className="mt-6 flex flex-col space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">All Basic Features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">Live Webinars</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">Certificate of Completion</span>
              </li>
            </ul>
            <div className="flex flex-col items-center justify-between mb-6">
              <p className="text-neutral-500 text-sm">Recommended</p>
              <p className="text-3xl font-bold text-neutral-900">$49/mo</p>
            </div>
            <button className="mt-6 rounded-full border border-neutral-900 bg-white px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">Select Plan</button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <div className="flex flex-col items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-neutral-900">Premium</h3>
              <p className="text-neutral-500">Full Access</p>
            </div>
            <ul className="mt-6 flex flex-col space-y-2 text-left">
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">All Standard Features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">1:1 Mentorship</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-500">✓</span>
                <span className="flex-grow">Career Coaching</span>
              </li>
            </ul>
            <div className="flex flex-col items-center justify-between mb-6">
              <p className="text-neutral-500 text-sm">Most Popular</p>
              <p className="text-3xl font-bold text-neutral-900">$79/mo</p>
            </div>
            <button className="mt-6 rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Select Plan</button>
          </div>
        </div>
      </div>
    </section>
  );
}
