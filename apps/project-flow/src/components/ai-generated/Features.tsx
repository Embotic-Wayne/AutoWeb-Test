export default function Features() {
  return (
    <section id="features" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Everything you need to succeed</h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">Our platform provides all the tools and resources you need to master new skills and achieve your goals.</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-center">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">Interactive Courses</h3>
            <p className="mt-2 text-neutral-500">Engage with hands-on projects and real-world exercises that reinforce your learning.</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-center">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">Community Learning</h3>
            <p className="mt-2 text-neutral-500">Connect with peers, join study groups, and collaborate on projects together.</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-center">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">Verified Certificates</h3>
            <p className="mt-2 text-neutral-500">Earn industry-recognized certificates to showcase your achievements.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
