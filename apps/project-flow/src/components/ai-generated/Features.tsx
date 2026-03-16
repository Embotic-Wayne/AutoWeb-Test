export default function Features() {
  return (
    <section id="features" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Everything you need to succeed</h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">Our platform provides all the tools and resources you need to master new skills and achieve your goals.</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="text-left">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-100 p-3">
              <span className="h-8 w-8 rounded-xl border border-neutral-300 bg-neutral-50 flex items-center justify-center">
                <span className="text-xl text-green-500">✓</span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">Hands-on Projects</h3>
            <p className="mt-2 text-neutral-500">Apply your learning with real-world projects that mirror professional challenges</p>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-100 p-3">
              <div className="h-8 w-8 rounded-xl border border-neutral-300 bg-neutral-50 flex items-center justify-center">
                <span className="text-xl text-blue-500">📚</span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">Community Learning</h3>
            <p className="mt-2 text-neutral-500">Connect with peers, join study groups, and collaborate on projects together</p>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-100 p-3">
              <div className="h-8 w-8 rounded-xl border border-neutral-300 bg-neutral-50 flex items-center justify-center">
                <span className="text-xl text-purple-500">🏆</span>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-neutral-900">Verified Certificates</h3>
            <p className="mt-2 text-neutral-500">Earn industry-recognized certificates to showcase your achievements</p>
          </div>
        </div>
      </div>
    </section>
  );
}
