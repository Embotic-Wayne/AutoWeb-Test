export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            New courses available
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">
            Learn without limits, grow without boundaries.
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-neutral-500">
            Access world-class education from top instructors. Master new
            skills, advance your career, and unlock your potential with our
            interactive learning platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              Start learning free
              <span>&rarr;</span>
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              <span>&#9654;</span>
              Watch demo
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-white bg-neutral-200"
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">
              50,000+ students already enrolled
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg">
          <h3 className="text-lg font-bold text-neutral-900">Course Progress</h3>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-2.5 flex-1 rounded-full bg-neutral-100">
              <div className="h-2.5 w-[85%] rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-medium text-green-600">+85%</span>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {["Mon", "Tue", "Wed"].map((day) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <div className="h-20 w-full rounded-lg bg-neutral-100" />
                <span className="text-xs text-neutral-400">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
