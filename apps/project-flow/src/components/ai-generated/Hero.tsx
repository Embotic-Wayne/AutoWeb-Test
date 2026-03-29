export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            New merch store now open
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">Learn without limits, grow without boundaries.</h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-500">Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="https://autonomous-test-delta.vercel.app/signup" className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Start learning free
            </a>
            <a href="https://autonomous-test-delta.vercel.app/courses" className="rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              Watch demo
            </a>
          </div>
          <div className="mt-12 flex items-center gap-8">
            <div className="text-sm text-neutral-400">
              50,000+ students already enrolled
            </div>
            <div className="text-sm text-neutral-400">
              200+ expert instructors across disciplines
            </div>
            <div className="text-sm text-neutral-400">
              98% completion rate industry leading
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-xl border border-neutral-200 bg-neutral-100 flex items-center justify-center">
              <span className="text-xl text-green-600">✓</span>
            </div>
            <h2 className="mt-4 text-xl font-bold text-neutral-900">Interactive Courses</h2>
            <p className="mt-2 text-neutral-500 text-lg">Engage with hands-on projects and real-world exercises that reinforce your learning.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
