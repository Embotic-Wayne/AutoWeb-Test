export default function Features() {
  return (
    <section id="features" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Learn Anything, Anywhere</h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">Access expert-taught courses on your schedule with lifetime access to materials</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center gap-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-3 flex flex-col items-center gap-2">
              <span className="text-xl text-green-600">📚</span>
              <h3 className="text-neutral-900 text-lg font-medium">Comprehensive Curriculum</h3>
              <p className="text-neutral-400 text-sm flex-grow">Access over 500 courses across multiple disciplines</p>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center gap-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-3 flex flex-col items-center gap-2">
              <span className="text-xl text-green-600">🎓</span>
              <h3 className="text-neutral-900 text-lg font-medium">Certified Completion</h3>
              <p className="text-neutral-400 text-sm flex-grow">Earn certificates verified by industry professionals</p>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 flex flex-col items-center gap-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-3 flex flex-col items-center gap-2">
              <span className="text-xl text-green-600">💼</span>
              <h3 className="text-neutral-900 text-lg font-medium">Career Growth</h3>
              <p className="text-neutral-400 text-sm flex-grow">Boost your career with in-demand skills and knowledge</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
