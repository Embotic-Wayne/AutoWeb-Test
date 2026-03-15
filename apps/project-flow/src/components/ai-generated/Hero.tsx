{"hero": "export default function Hero() {
  return (
    <section className=\"relative bg-gray-900 text-white py-24 px-4 max-w-5xl mx-auto shadow-lg\">
      <div className=\"container flex flex-col items-center justify-center text-center lg:items-start lg:justify-between lg:flex\">
        <div className=\"flex flex-col items-center mb-8 lg:mb-0 lg:order-2 lg:justify-start\">
          <h1 className=\"text-4xl md:text-5xl font-extrabold tracking-tight\">Learn without limits, grow without boundaries.</h1>
          <p className=\"mt-3 text-lg text-gray-300\">
            Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.
          </p>
        </div>
        <div className=\"flex flex-wrap justify-center gap-4\">
          <a href=\"https://autonomous-test-delta.vercel.app/courses\" className=\"px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform \\"shadow-lg\\"\">Start learning free\</a>
          <a href=\"https://autonomous-test-delta.vercel.app/signup\" className=\"px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition transform \\"shadow-lg\\"\">Get Started\</a>
        </div>
      </div>
    </section>
  );
}",
  "pricing": "export default function Pricing() {
  return (
    <section className=\"relative bg-gray-50 py-20 px-4 max-w-4xl mx-auto\">
      <div className=\"container text-center\">
        <h2 className=\"text-3xl font-bold mb-8\">Pricing Plans\</h2>
        <div className=\"grid grid-cols-1 sm:grid-cols-3 gap-8\">
          {/* Basic Plan */}
          <div className=\"bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition transform\">
            <h3 className=\"text-xl font-semibold mb-2\">Basic\</h3>
            <p className=\"text-4xl font-bold\">$19/mo\</p>
            <ul className=\"mt-4 list-none space-y-2 text-left\">
              <li>Access to all beginner courses</li>
              <li>Community forum access</li>
              <li>Monthly webinars</li>
            </ul>
            <a href=\"https://autonomous-test-delta.vercel.app/enroll\" className=\"mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition\">Enroll Now\</a>
          </div>
          {/* Pro Plan */}
          <div className=\"bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition transform\">
            <h3 className=\"text-xl font-semibold mb-2\">Pro\</h3>
            <p className=\"text-4xl font-bold\">$49/mo\</p>
            <ul className=\"mt-4 list-none space-y-2 text-left\">
              <li>All Basic features</li>
              <li>Unlimited course access</li>
              <li>Live coding sessions</li>
              <li>Certificate of completion</li>
            </ul>
            <a href=\"https://autonomous-test-delta.vercel.app/enroll\" className=\"mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition\">Enroll Now\</a>
          </div>
          {/* Enterprise Plan */}
          <div className=\"bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition transform\">
            <h3 className=\"text-xl font-semibold mb-2\">Enterprise\</h3>
            <p className=\"text-4xl font-bold\">Custom\</p>
            <ul className=\"mt-4 list-none space-y-2 text-left\">
              <li>All Pro features</li>
              <li>Dedicated account manager</li>
              <li>On-site training</li>
              <li>Custom curriculum\</li>
            </ul>
            <a href=\"https://autonomous-test-delta.vercel.app/contact\" className=\"mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition\">Contact Sales\</a>
          </div>
        </div>
      </div>
    </section>
  );
}",
  "features": "export default function Features() {
  return (
    <section className=\"relative bg-gray-100 py-24 px-4 max-w-5xl mx-auto\">
      <div className=\"container\">
        <h2 className=\"text-3xl font-bold text-center mb-16\">Everything you need to succeed\</h2>
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-8\">
          {/* Interactive Courses */}
          <div className=\"bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition transform\">
            <div className=\"mt-4 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center\">
              <svg className=\"w-6 h-6 text-white\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">
                <path d=\"M12 2L1 1h24l1 2H13v10H11V3h4v1\" fill=\"currentColor\"/\>
              </svg>
            </div>
            <h3 className=\"mt-3 text-xl font-semibold\">Interactive Courses\</h3>
            <p className=\"mt-2 text-gray-600\">Hands-on projects and real-world exercises that reinforce your learning.</p>
          </div>
          {/* Community Learning */}
          <div className=\"bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition transform\">
            <div className=\"mt-4 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center\">
              <svg className=\"w-6 h-6 text-white\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">
                <path d=\"M20.35 4.586c-.885.394-1.83-.754-2.033-1.637a7.03 7.03 0 0 0 1.586-5.466c.566-.823 1.25-.896 1.933-.423l.063.063c.287.287.287.754 0 1.042l-.062.062c-.287.287-.754.287-1.042 0a7.03 7.03 0 0 0-5.466 1.586c-.823.566-.896 1.25-.423 1.933l.062.063c-.287.287-.754.287-1.042 0a7.03 7.03 0 0 0 1.586 5.466c.566.823 1.25.896 1.933.423l.063-.063c.287-.287.287-.754 0-1.042a7.03 7.03 0 0 0-1.586-5.466z\" fill=\"currentColor\"/\>
              </svg>
            </div>
            <h3 className=\"mt-3 text-xl font-semibold\">Community Learning\</h3>
            <p className=\"mt-2 text-gray-600\">Connect with peers, join study groups, and collaborate on projects together.\</p>
          </div>
          {/* Verified Certificates */}
          <div className=\"bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition transform\">
            <div className=\"mt-4 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center\">
              <svg className=\"w-6 h-6 text-white\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">
                <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.67 0-4.85 1.656-5.8 3.55 0 0 0 0 0 0c.14.14.14.35.08.48a11.99 11.99 0 0 1-1.63-2.44c-.38-.38-.88-.38-1.26 0a12.07 12.07 0 0 0 1.71 1.71c-.38.38-.38.88 0 1.26z\" fill=\"currentColor\"/\>
              </svg>
            </div>
            <h3 className=\"mt-3 text-xl font-semibold\">Verified Certificates\</h3>
            <p className=\"mt-2 text-gray-600\">Earn industry-recognized certificates to showcase your achievements.\</p>
          </div>
        </div>
        <div className=\"mt-16 text-center\">
          <a href=\"https://autonomous-test-delta.vercel.app/courses\" className=\"px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform \\"shadow-lg\\"\">Start your learning journey\</a>
        </div>
      </div>
    </section>
  );
}"}
