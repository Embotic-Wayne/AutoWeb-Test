export default function Courses() {
  return (
    <section id="courses" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-neutral-900">Top Courses</h2>
        <p className="mt-2 text-neutral-500">Featured programs to accelerate your learning</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100 rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-700">New</span>
                <h3 className="text-neutral-900 text-lg font-medium">Web Development Bootcamp</h3>
              </div>
              <p className="text-neutral-500 text-sm flex-grow">Master full-stack development with HTML, CSS, JavaScript, and React</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-neutral-500">4.8 ★ (1,200)</span>
                <span className="text-neutral-500">8 hrs</span>
                <span className="text-neutral-500">120</span>
              </div>
              <button className="mt-6 rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Enroll</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100 rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-700">Popular</span>
                <h3 className="text-neutral-900 text-lg font-medium">Data Science Mastery</h3>
              </div>
              <p className="text-neutral-500 text-sm flex-grow">Analyze complex datasets with Python, SQL, and machine learning techniques</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-neutral-500">4.9 ★ (950)</span>
                <span className="text-neutral-500">12 hrs</span>
                <span className="text-neutral-500">180</span>
              </div>
              <button className="mt-6 rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Enroll</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="h-48 bg-neutral-100 rounded-t-2xl" />
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-yellow-50 text-yellow-700">Trending</span>
                <h3 className="text-neutral-900 text-lg font-medium">AI Fundamentals</h3>
              </div>
              <p className="text-neutral-500 text-sm flex-grow">Explore artificial intelligence concepts with hands-on projects</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-neutral-500">4.7 ★ (780)</span>
                <span className="text-neutral-500">6 hrs</span>
                <span className="text-neutral-500">45</span>
              </div>
              <button className="mt-6 rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Enroll</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
