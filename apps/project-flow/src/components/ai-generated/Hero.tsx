{"hero": "export default function Hero() {
  return (
    <section className=\'py-16 px-4 bg-gray-50 rounded-lg shadow-md\' className=\'max-w-4xl mx-auto text-gray-900\'>
      <div className=\'text-center\'>
        <h1 className=\'text-4xl md:text-5xl font-bold text-gray-900 mb-2\'>Learn without limits, grow without boundaries.</h1>
        <p className=\'text-lg text-gray-600 mb-8\'>Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.</p>
        <div className=\'flex flex-col sm:flex-row justify-center sm:justify-start gap-4\'>
          <a href=\'https://autonomous-test-delta.vercel.app/signup\' className=\'inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition\'>Start learning free</a>
          <a href=\'https://autonomous-test-delta.vercel.app/login\' className=\'inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition\'>Log in</a>
        </div>
      </div>
    </section>
  );
}","pricing": "export default function Pricing() {
  return (
    <section className=\'py-16 px-4 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto\'>
      <h2 className=\'text-3xl font-bold text-center text-gray-900 mb-12\'>Choose the plan that fits you</h2>
      <div className=\'grid grid-cols-1 md:grid-cols-3 gap-8\'>
        {/* Basic Plan */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition\'>
          <h3 className=\'text-xl font-semibold text-gray-800 mb-2\'>Basic</h3>
          <p className=\'text-2xl font-bold text-blue-600 mb-4\'>$29/mo</p>
          <ul className=\'list-disc list-inside mb-6 text-gray-700\'>
            <li>Access to all beginner courses</li>
            <li>Hands-on projects</li>
            <li>Community forum access</li>
            <li>Weekly webinars</li>
          </ul>
          <a href=\'https://autonomous-test-delta.vercel.app/enroll\' className=\'w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition\'>Select</a>
        </div>
        {/* Pro Plan */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition\'>
          <h3 className=\'text-xl font-semibold text-gray-800 mb-2\'>Pro</h3>
          <p className=\'text-2xl font-bold text-blue-600 mb-4\'>$49/mo</p>
          <ul className=\'list-disc list-inside mb-6 text-gray-700\'>
            <li>All Basic features</li>
            <li>Advanced courses</li>
            <li>Live mentorship sessions</li>
            <li>Project feedback</li>
            <li>Certificate of completion</li>
          </ul>
          <a href=\'https://autonomous-test-delta.vercel.app/enroll\' className=\'w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition\'>Select</a>
        </div>
        {/* Enterprise Plan */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition\'>
          <h3 className=\'text-xl font-semibold text-gray-800 mb-2\'>Enterprise</h3>
          <p className=\'text-2xl font-bold text-blue-600 mb-4\'>Custom pricing</p>
          <ul className=\'list-disc list-inside mb-6 text-gray-700\'>
            <li>All Pro features</li>
            <li>Dedicated account manager</li>
            <li>On-site training</li>
            <li>Custom curriculum</li>
            <li>Priority support</li>
          </ul>
          <a href=\'https://autonomous-test-delta.vercel.app/contact\' className=\'w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition\'>Contact Sales</a>
        </div>
      </div>
    </section>
  );
}","features": "export default function Features() {
  return (
    <section className=\'py-16 px-4 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto\'>
      <h2 className=\'text-3xl font-bold text-center text-gray-900 mb-12\'>Everything you need to succeed</h2>
      <div className=\'grid grid-cols-1 md:grid-cols-3 gap-8\'>
        {/* Interactive Courses */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col items-center text-center\'>
          <div className=\'w-12 h-12 rounded-full bg-blue-100\'/>
          <h3 className=\'mt-4 text-xl font-semibold text-gray-800\'>Interactive Courses</h3>
          <p className=\'mt-2 text-gray-600\'>Engage with hands-on projects and real-world exercises that reinforce your learning.</p>
        </div>
        {/* Community Learning */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col items-center text-center\'>
          <div className=\'w-12 h-12 rounded-full bg-green-100\'/>
          <h3 className=\'mt-4 text-xl font-semibold text-gray-800\'>Community Learning</h3>
          <p className=\'mt-2 text-gray-600\'>Connect with peers, join study groups, and collaborate on projects together.</p>
        </div>
        {/* Verified Certificates */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition flex flex-col items-center text-center\'>
          <div className=\'w-12 h-12 rounded-full bg-purple-100\'/>
          <h3 className=\'mt-4 text-xl font-semibold text-gray-800\'>Verified Certificates</h3>
          <p className=\'mt-2 text-gray-600\'>Earn industry-recognized certificates to showcase your achievements.</p>
        </div>
      </div>
      <div className=\'mt-12 grid grid-cols-1 md:grid-cols-2 gap-8\'>
        {/* Popular Courses */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition\'>
          <h3 className=\'text-xl font-semibold text-gray-800 mb-2\'>Web Development Bootcamp</h3>
          <p className=\'text-gray-600\'>Master HTML, CSS, JavaScript, and React with hands-on projects.</p>
          <div className=\'flex items-center justify-between mt-4\'>
            <span className=\'text-blue-600 font-medium\'>12 weeks • 15,400 students • 4.9</span>
            <a href=\'https://autonomous-test-delta.vercel.app/enroll\' className=\'text-blue-600 hover:underline\'>Enroll Now</a>
          </div>
        </div>
        {/* Data Science Fundamentals */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition\'>
          <h3 className=\'text-xl font-semibold text-gray-800 mb-2\'>Data Science Fundamentals</h3>
          <p className=\'text-gray-600\'>Learn Python, statistics, and machine learning from scratch.</p>
          <div className=\'flex items-center justify-between mt-4\'>
            <span className=\'text-blue-600 font-medium\'>10 weeks • 12,300 students • 4.8</span>
            <a href=\'https://autonomous-test-delta.vercel.app/enroll\' className=\'text-blue-600 hover:underline\'>Enroll Now</a>
          </div>
        </div>
        {/* UX/UI Design Mastery */}
        <div className=\'rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition\'>
          <h3 className=\'text-xl font-semibold text-gray-800 mb-2\'>UX/UI Design Mastery</h3>
          <p className=\'text-gray-600\'>Create stunning user experiences with modern design principles.</p>
          <div className=\'flex items-center justify-between mt-4\'>
            <span className=\'text-blue-600 font-medium\'>8 weeks • 9,800 students • 4.9</span>
            <a href=\'https://autonomous-test-delta.vercel.app/enroll\' className=\'text-blue-600 hover:underline\'>Enroll Now</a>
          </div>
        </div>
      </div>
      <div className=\'mt-12 flex justify-center\'>
        <a href=\'https://autonomous-test-delta.vercel.app/signup\' className=\'text-blue-600 hover:underline font-medium\'>Start your free trial today</a>
      </div>
    </section>
  );
}"}
