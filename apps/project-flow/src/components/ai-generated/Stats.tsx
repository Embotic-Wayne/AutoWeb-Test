export default function Stats() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900">85%</div>
            <div className="text-sm font-semibold text-neutral-900">Course Progress</div>
            <div className="text-sm text-neutral-400">Mon Tue Wed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900">50K+</div>
            <div className="text-sm font-semibold text-neutral-900">Active students</div>
            <div className="text-sm text-neutral-400">learning daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900">200+</div>
            <div className="text-sm font-semibold text-neutral-900">Expert instructors</div>
            <div className="text-sm text-neutral-400">across disciplines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-neutral-900">98%</div>
            <div className="text-sm font-semibold text-neutral-900">Completion rate</div>
            <div className="text-sm text-neutral-400">industry leading</div>
          </div>
        </div>
      </div>
    </section>
  );
}
