export default function Features() {
  return (
    <section className="py-20 px-4 md:py-24"'>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to succeed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{
          {/* Interactive Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0-2.421 1.642-4.42 4-4.42a2.88 2.88 0 110 5.655c-1.215 1.01-.97.348-.54.12a7.03 7.03 0 010 10.018c.58.35 1.26.54 2 .54a2.88 2.88 0 110-5.655z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Courses</h3>
            <p className="text-gray-600 text-center">Engage with hands-on projects and real-world exercises that reinforce your learning.</p>
          </div>
          {/* Community Learning */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0-2.421 1.642-4.42 4-4.42a2.88 2.88 0 110 5.655c-1.215 1.01-.97.348-.54.12a7.03 7.03 0 010 10.018c.58.35 1.26.54 2 .54a2.88 2.88 0 110-5.655z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Learning</h3>
            <p className="text-gray-600 text-center">Connect with peers, join study groups, and collaborate on projects together.</p>
          </div>
          {/* Verified Certificates */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.657-1.657L13 14.657a11.955 11.955 0 01-17-17 12.05 12.05 0 000 17z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Certificates</h3>
            <p className="text-gray-600 text-center">Earn industry-recognized certificates to showcase your achievements.</p>
          </div>
        </div>
        <div className="mt-16 text-center">
          <a href="https://autonomous-test-delta.vercel.app/signup" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Get started for free</a>
        </div>
      </div>
    </section>
  );
}
