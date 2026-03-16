export default function Courses() {
  return (
    <section id="courses" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-neutral-900">Popular Courses</h2>
        <p className="mt-2 text-neutral-500">Master in-demand skills with our expert-led courses.</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100 rounded-t-2xl"></div>
            <div className="p-6 flex flex-col">
              <div className="mt-2 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">Web Development</div>
              <h3 className="mt-3 text-neutral-900 font-medium text-lg">Web Development Bootcamp</h3>
              <p className="mt-1 text-neutral-500 text-sm">Master HTML, CSS, JavaScript, and React with hands-on projects.</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">12 weeks</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">15,400</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">4.9</span>
              </div>
              <button className="mt-6 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">Enroll Now</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100 rounded-t-2xl"></div>
            <div className="p-6 flex flex-col">
              <div className="mt-2 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">Data Science</div>
              <h3 className="mt-3 text-neutral-900 font-medium text-lg">Data Science Fundamentals</h3>
              <p className="mt-1 text-neutral-500 text-sm">Learn Python, statistics, and machine learning from scratch.</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">10 weeks</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">12,300</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">4.8</span>
              </div>
              <button className="mt-6 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">Enroll Now</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100 rounded-t-2xl"></div>
            <div className="p-6 flex flex-col">
              <div className="mt-2 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">Design</div>
              <h3 className="mt-3 text-neutral-900 font-medium text-lg">UX/UI Design Mastery</h3>
              <p className="mt-1 text-neutral-500 text-sm">Create stunning user experiences with modern design principles.</p>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">8 weeks</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">9,800</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">4.9</span>
              </div>
              <button className="mt-6 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">Enroll Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
