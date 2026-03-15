export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-24 px-4 md:py-32 md:px-6"'>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">{'Learn without limits, grow without boundaries.'}</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-start gap-4">
          <a href="https://autonomous-test-delta.vercel.app/signup" className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Start learning free</a>
          <a href="https://autonomous-test-delta.vercel.app/login" className="inline-block mt-4 px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors">Log in</a>
        </div>
      </div>
    </section>
  );
}
