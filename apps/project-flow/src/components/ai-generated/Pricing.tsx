export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Pricing Title</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">Subtitle</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center">
            <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
              Most Popular
            </span>
            <span className="text-2xl font-bold text-neutral-900 mt-2">$29/month</span>
            <ul className="mt-6 w-full space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Unlimited AI generations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Advanced model access</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Custom AI training</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">API access</span>
              </li>
            </ul>
            <button className="rounded-full bg-neutral-900 mt-6 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Upgrade to Pro
            </button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              Free
            </span>
            <span className="text-2xl font-bold text-neutral-900 mt-2">$0/month</span>
            <ul className="mt-6 w-full space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">100 AI generations per month</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Basic model access</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Community support</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Standard response time</span>
              </li>
            </ul>
            <button className="rounded-full bg-neutral-900 mt-6 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Get Started
            </button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center">
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              Team
            </span>
            <span className="text-2xl font-bold text-neutral-900 mt-2">$49/user/month</span>
            <ul className="mt-6 w-full space-y-2 text-left">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Team collaboration tools</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Shared workspaces</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Admin dashboard</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">Centralized billing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-neutral-900">SSO authentication</span>
              </li>
            </ul>
            <button className="rounded-full bg-neutral-900 mt-6 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Start a Team plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
