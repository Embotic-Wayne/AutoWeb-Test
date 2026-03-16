export default function Stats() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-neutral-900">50K+</span>
            <span className="text-sm text-neutral-500">Active students</span>
            <span className="text-sm text-neutral-400">learning daily</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-neutral-900">98%</span>
            <span className="text-sm text-neutral-500">Completion rate</span>
            <span className="text-sm text-neutral-400">industry leading</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-neutral-900">200+</span>
            <span className="text-sm text-neutral-500">Expert instructors</span>
            <span className="text-sm text-neutral-400">across disciplines</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-neutral-900">+85%</span>
            <span className="text-sm text-neutral-500">Course progress</span>
            <span className="text-sm text-neutral-400">Mon - Tue - Wed</span>
          </div>
        </div>
      </div>
    </section>
  );
}
