export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Course Pricing</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">Choose the plan that fits your learning goals.</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center justify-between">
            <span className="rounded-full px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600">Basic</span>
            <h3 className="mt-4 text-2xl font-bold text-neutral-900">$29/month</h3>
            <ul className="mt-6 w-full space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">200+ Courses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Certificates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Community Access</span>
              </li>
            </ul>
            <button className="mt-8 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Get Started</button>
          </div>
          <div className="rounded-2xl border border-neutral-900 shadow-lg bg-white p-8 flex flex-col items-center justify-between">
            <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-700">Most Popular</span>
            <h3 className="mt-4 text-2xl font-bold text-neutral-900">$39/month</h3>
            <ul className="mt-6 w-full space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Unlimited Courses</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Certificates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Community Access</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Priority Support</span>
              </li>
            </ul>
            <button className="mt-8 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Get Started</button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center justify-between">
            <span className="rounded-full px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600">Enterprise</span>
            <h3 className="mt-4 text-2xl font-bold text-neutral-900">Custom Pricing</h3>
            <ul className="mt-6 w-full space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Dedicated Account Manager</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">Custom Curriculum</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">SLA Guarantee</span>
              </li>
            </ul>
            <button className="mt-8 rounded-full border border-neutral-900 px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors">Request Demo</button>
          </div>
        </div>
      </div>
    </section>
  );
}
