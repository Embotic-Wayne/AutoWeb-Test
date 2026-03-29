export default function Courses() {
  return (
    <section id="courses" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-neutral-900">Popular Courses</h2>
        <p className="mt-2 text-neutral-500">Start your learning journey with our most loved courses</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100"></div>
            <div className="p-4">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600">Beginner</span>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">Web Development Bootcamp</h3>
              <p className="mt-1 text-neutral-500">Master HTML, CSS, JavaScript, and React with hands-on projects.</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">12 weeks</span>
                  <span className="text-sm text-neutral-400">15,400</span>
                  <span className="text-sm text-neutral-400">4.9</span>
                </div>
                <button className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100"></div>
            <div className="p-4">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600">Intermediate</span>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">Data Science Fundamentals</h3>
              <p className="mt-1 text-neutral-500">Learn Python, statistics, and machine learning from scratch.</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">10 weeks</span>
                  <span className="text-sm text-neutral-400">12,300</span>
                  <span className="text-sm text-neutral-400">4.8</span>
                </div>
                <button className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100"></div>
            <div className="p-4">
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium bg-neutral-100 text-neutral-600">All Levels</span>
              <h3 className="mt-3 text-lg font-bold text-neutral-900">UX/UI Design Mastery</h3>
              <p className="mt-1 text-neutral-500">Create stunning user experiences with modern design principles.</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-400">8 weeks</span>
                  <span className="text-sm text-neutral-400">9,800</span>
                  <span className="text-sm text-neutral-400">4.9</span>
                </div>
                <button className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
