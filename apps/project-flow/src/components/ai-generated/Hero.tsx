export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Free trial badge
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">Learn without limits, grow without boundaries.</h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-500">Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Start Learning Free</button>
            <button className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">Watch Demo</button>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <span className="text-green-600">50,000+</span> students already enrolled
            <span className="ml-4 text-neutral-400">|</span>
            <span className="text-green-600">98%</span> Completion rate
            <span className="ml-4 text-neutral-400">|</span>
            <span className="text-green-600">4.9</span> Average rating
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">New courses available</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">|</span>
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">50K+ active learners</span>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <div className="h-48 bg-neutral-100 rounded-lg mb-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border border-neutral-200 bg-white flex items-center justify-center">
              <span className="h-6 w-6 rounded-full bg-green-500">🎓</span>
            </div>
            <span className="mt-2 text-neutral-600 text-sm">Verified Certificate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
