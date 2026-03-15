export default function Pricing() {
  return (
    <section className="py-20 px-4 md:py-24"'>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Choose the plan that fits your goals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">{
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Free</h3>
            <p className="text-2xl font-bold text-indigo-600">$0</p>
            <ul className="mt-4 w-full space-y-3 text-left">
              <li>Unlimited courses</li>
              <li>Community access</li>
              <li>Email support</li>
            </ul>
            <a href="https://autonomous-test-delta.vercel.app/signup" className="mt-6 inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Get started</a>
          </div>
          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Pro</h3>
            <p className="text-2xl font-bold text-indigo-600 mb-2">$29/mo</p>
            <ul className="mt-4 w-full space-y-3 text-left">
              <li>All courses</li>
              <li>Certificates</li>
              <li>Priority support</li>
              <li>Weekly workshops</li>
            </ul>
            <a href="https://autonomous-test-delta.vercel.app/signup" className="mt-6 inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Upgrade to Pro</a>
          </div>
          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Enterprise</h3>
            <p className="text-2xl font-bold text-indigo-600 mb-2">Custom pricing</p>
            <ul className="mt-4 w-full space-y-3 text-left">
              <li>Everything in Pro</li>
              <li>Dedicated account manager</li>
              <li>Custom training programs</li>
              <li>Advanced analytics</li>
            </ul>
            <a href="https://autonomous-test-delta.vercel.app/contact" className="mt-6 inline-block px-8 py-3 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">Contact Sales</a>
          </div>
        </div>
      </div>
    </section>
  );
}
