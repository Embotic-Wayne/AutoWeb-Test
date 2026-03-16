export default function Features() {
  return (
    <section id="features" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Learn Anywhere, Anytime</h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">Access courses on any device with offline support and progress sync</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="text-left">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center h-10 w-10 rounded-xl border border-neutral-200 bg-neutral-50">
                <span className="text-2xl text-green-600">🎓</span>
              </div>
              <h3 className="text-neutral-900 text-lg font-medium">Structured Learning</h3>
              <p className="mt-2 text-neutral-400 text-sm">Follow proven paths with clear milestones</p>
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center h-10 w-10 rounded-xl border border-neutral-200 bg-neutral-50">
                <span className="text-2xl text-neutral-600">💬</span>
              </div>
              <h3 className="text-neutral-900 text-lg font-medium">Community Support</h3>
              <p className="mt-2 text-neutral-400 text-sm">Join study groups and collaborate with peers</p>
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center h-10 w-10 rounded-xl border border-neutral-200 bg-neutral-50">
                <span className="text-2xl text-neutral-600">⏱️</span>
              </div>
              <h3 className="text-neutral-900 text-lg font-medium">Flexible Scheduling</h3>
              <p className="mt-2 text-neutral-400 text-sm">Learn at your own pace, anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
