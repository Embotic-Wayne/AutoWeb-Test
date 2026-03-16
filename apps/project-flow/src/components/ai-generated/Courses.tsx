export default function Courses() {
  return (
    <section id="courses" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-neutral-900">Popular Courses</h2>
        <p className="mt-2 text-neutral-500">Master in-demand skills with our most popular courses</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100">
              <span className="absolute inset-0 flex items-center justify-center text-neutral-300 text-xl">Web Dev</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-neutral-500 text-sm">Web Development</p>
                  <h3 className="mt-2 text-neutral-900 text-lg font-medium">Web Development Bootcamp</h3>
                  <p className="mt-1 text-neutral-400">Master HTML, CSS, JavaScript, and React with hands-on projects</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-green-500"></span>
                    <span className="text-xs text-green-600 font-medium">Beginner</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-neutral-200 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-neutral-500 text-xs">4.9</span>
                  </div>
                  <button className="mt-4 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100">
              <span className="absolute inset-0 flex items-center justify-center text-neutral-300 text-xl">Data</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-neutral-500 text-sm">Data Science</p>
                  <h3 className="mt-2 text-neutral-900 text-lg font-medium">Data Science Fundamentals</h3>
                  <p className="mt-1 text-neutral-400">Learn Python, statistics, and machine learning from scratch</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-green-500"></span>
                    <span className="text-xs text-green-600 font-medium">Intermediate</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-neutral-200 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-neutral-500 text-xs">4.8</span>
                  </div>
                  <button className="mt-4 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100">
              <span className="absolute inset-0 flex items-center justify-center text-neutral-300 text-xl">Design</span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-neutral-500 text-sm">UX/UI Design</p>
                  <h3 className="mt-2 text-neutral-900 text-lg font-medium">UX/UI Design Mastery</h3>
                  <p className="mt-1 text-neutral-400">Create stunning user experiences with modern design principles</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-green-500"></span>
                    <span className="text-xs text-green-600 font-medium">All Levels</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-neutral-200 flex items-center justify-center">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    <span className="text-neutral-500 text-xs">4.9</span>
                  </div>
                  <button className="mt-4 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
