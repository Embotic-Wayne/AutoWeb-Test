export default function Pricing() {
  return (
    <section id="pricing" className="px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Pricing Plans</h2>
        <p className="text-[#a0a0a0] mb-12">Choose the plan that fits your learning goals</p>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl bg-[#1a1a1a] border border-[#262626] p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
            <p className="text-[#76b900] font-medium">$0/month</p>
            <ul className="mt-4 flex flex-col space-y-2 text-[#a0a0a0] mb-6">
              <li>Access to 5 courses</li>
              <li>Community support</li>
              <li>Basic quizzes</li>
            </ul>
            <a href="/signup" className="mt-6 rounded-lg bg-[#76b900] px-6 py-3 text-sm font-medium text-black hover:bg-[#8ed100] transition-colors">Get Started</a>
          </div>
          <div className="rounded-xl bg-[#1a1a1a] border-2 border-[#76b900] p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-[#76b900] font-medium">$29/month</p>
            <ul className="mt-4 flex flex-col space-y-2 text-[#a0a0a0] mb-6">
              <li>Unlimited course access</li>
              <li>Certificates included</li>
              <li>Live webinars</li>
              <li>Priority support</li>
            </ul>
            <a href="/signup" className="mt-6 rounded-lg bg-[#76b900] px-6 py-3 text-sm font-medium text-black hover:bg-[#8ed100] transition-colors">Upgrade to Pro</a>
          </div>
          <div className="rounded-xl bg-[#1a1a1a] border border-[#262626] p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-[#76b900] font-medium">$99/month</p>
            <ul className="mt-4 flex flex-col space-y-2 text-[#a0a0a0] mb-6">
              <li>Custom learning paths</li>
              <li>Dedicated account manager</li>
              <li>On-site training</li>
              <li>Advanced analytics</li>
            </ul>
            <a href="/signup" className="mt-6 rounded-lg border border-[#76b900] bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-[#76b900] hover:bg-[#1a1a1a] transition-colors">Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}
