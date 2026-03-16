export default function Courses() {
  return (
    <section id="courses" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-neutral-900">Popular Courses</h2>
        <p className="mt-2 text-neutral-500">Start your learning journey with our most loved courses</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100"></div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-xs bg-green-50 text-green-700">Beginner</span>
                <span className="rounded-full px-3 py-1 text-xs bg-neutral-50 text-neutral-600">Self-Paced</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">Web Development Bootcamp</h3>
              <p className="mt-2 text-neutral-500">Master HTML, CSS, JavaScript, and React with hands-on projects</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">12 weeks</span>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">15,400\u2b50 4.9</span>
                <button className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors">Enroll Now</button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100"></div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-xs bg-green-50 text-green-700">Intermediate</span>
                <span className="rounded-full px-3 py-1 text-xs bg-neutral-50 text-neutral-600">Self-Paced</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">Data Science Fundamentals</h3>
              <p className="mt-2 text-neutral-500">Learn Python, statistics, and machine learning from scratch</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">10 weeks</span>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">12,300\u2b50 4.8</span>
                <button className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors">Enroll Now</button>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100"></div>
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-xs bg-green-50 text-green-700">All Levels</span>
                <span className="rounded-full px-3 py-1 text-xs bg-neutral-50 text-neutral-600">Self-Paced</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">UX/UI Design Mastery</h3>
              <p className="mt-2 text-neutral-500">Create stunning user experiences with modern design principles</p>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">8 weeks</span>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">9,800\u2b50 4.9</span>
                <button className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-medium text-white hover:bg-neutral-800 transition-colors">Enroll Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
