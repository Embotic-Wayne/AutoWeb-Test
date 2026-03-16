export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Explore Courses
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">A New Way to Learn</h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-500">Master new skills with expert-led courses and hands-on projects</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="/courses" className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Start Learning Free
            </a>
            <a href="/courses" className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              View Catalog
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <span className="text-sm text-neutral-400">Join 50,000+ students</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              4.9 avg rating
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                <span className="text-green-600">✓</span>
              </span>
              <div className="flex-1">
                <p className="text-neutral-500 text-sm">Interactive Learning</p>
                <p className="text-neutral-900 font-medium text-base">Learn by doing with real-world projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                <span className="text-green-600">📚</span>
              </span>
              <div className="flex-1">
                <p className="text-neutral-500 text-sm">Structured Paths</p>
                <p className="text-neutral-900 font-medium text-base">Clear learning paths from beginner to advanced</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
                <span className="text-green-600">🏆</span>
              </span>
              <div className="flex-1">
                <p className="text-neutral-500 text-sm">Career Focused</p>
                <p className="text-neutral-900 font-medium text-base">Certificates that advance your career</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
