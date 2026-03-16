export default function Pricing() {
  return (
    <section id="pricing" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Pricing Plans</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-500">Choose the plan that's right for you</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-neutral-900 font-medium">Free</h3>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">Beginner</span>
            </div>
            <ul className="space-y-2 text-left">
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">100 AI generations per month</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Basic model access</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Community support</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Standard response time</span>
              </li>
            </ul>
            <div className="mt-6 flex justify-center">
              <a href="/signup" className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                Get Started
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-900 shadow-lg bg-white p-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-neutral-900 font-medium">Pro</h3>
              <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">Most Popular</span>
            </div>
            <ul className="space-y-2 text-left">
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Unlimited AI generations</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Advanced model access</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Priority support</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Custom AI training</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">API access</span>
              </li>
            </ul>
            <div className="mt-6 flex justify-center">
              <a href="/signup?plan=pro" className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                Upgrade to Pro
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-neutral-900 font-medium">Team</h3>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">Recommended</span>
            </div>
            <ul className="space-y-2 text-left">
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Everything in Pro</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Team collaboration tools</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Shared workspaces</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Admin dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">Centralized billing</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center flex-col w-4 h-4 bg-green-500 rounded-full mr-3 mt-0.5"></span>
                <span className="text-neutral-500">SSO authentication</span>
              </li>
            </ul>
            <div className="mt-6 flex justify-center">
              <a href="/signup?plan=team" className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                Start Team Plan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
