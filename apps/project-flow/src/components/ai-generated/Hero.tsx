export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Learnify
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">Learn without limits, grow without boundaries.</h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-500">Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="https://auto-web-test-auto-test-comp.vercel.app/courses" className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Start learning free
            </a>
            <a href="https://auto-web-test-auto-test-comp.vercel.app/signup" className="rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              Watch demo
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <span className="text-green-600 text-sm">
              50,000+ students already enrolled
            </span>
            <span className="text-neutral-400 text-sm">
              learning daily
            </span>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Interactive Courses
            </span>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Community Learning
            </span>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              Verified Certificates
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="h-12 bg-neutral-100 rounded-lg">
              <span className="w-full h-full bg-neutral-100" />
            </div>
            <div className="h-24 bg-neutral-100 rounded-lg">
              <span className="w-full h-full bg-neutral-100" />
            </div>
            <div className="h-16 bg-neutral-100 rounded-lg">
              <span className="w-full h-full bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
