export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Simple, transparent pricing for every learner
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Free</h3>
            <p className="text-3xl font-bold text-blue-600 mb-6">$0</p>
            <ul className="text-gray-600 mb-8">
              <li>Access to basic courses</li>
              <li>Community support</li>
              <li>Email assistance</li>
            </ul>
            <a href="#"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Get started
            </a>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pro</h3>
            <p className="text-3xl font-bold text-blue-600 mb-6">
              $29/mo
            </p>
            <ul className="text-gray-600 mb-8">
              <li>All Free features</li>
              <li>Interactive projects</li>
              <li>Certificates</li>
              <li>Priority support</li>
            </ul>
            <a href="#"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Subscribe
            </a>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Enterprise</h3>
            <p className="text-3xl font-bold text-blue-600 mb-6">
              Custom pricing
            </p>
            <ul className="text-gray-600 mb-8">
              <li>Everything in Pro</li>
              <li>Team collaboration</li>
              <li>Advanced analytics</li>
              <li>Dedicated account manager</li>
            </ul>
            <a href="#"
              className="inline-block px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition"
            >
              Contact sales
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
