export default function Stats() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Active students</p>
          <p className="text-3xl font-bold text-neutral-900">50,000+</p>
          <p className="text-neutral-400 text-sm">learning daily</p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Expert instructors</p>
          <p className="text-3xl font-bold text-neutral-900">200+</p>
          <p className="text-neutral-400 text-sm">across disciplines</p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Completion rate</p>
          <p className="text-3xl font-bold text-neutral-900">98%</p>
          <p className="text-neutral-400 text-sm">industry leading</p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Average rating</p>
          <p className="text-3xl font-bold text-neutral-900">4.9</p>
          <p className="text-neutral-400 text-sm">from learners</p>
        </div>
      </div>
    </section>
  );
}
