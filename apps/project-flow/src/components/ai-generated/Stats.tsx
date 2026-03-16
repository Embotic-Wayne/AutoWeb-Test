export default function Stats() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <span className="text-3xl font-bold text-neutral-900">50,000+</span>
            <span className="text-neutral-500">Active students</span>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-neutral-900">98%</span>
            <span className="text-neutral-500">Completion rate</span>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-neutral-900">4.9</span>
            <span className="text-neutral-500">Average rating</span>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-neutral-900">200+</span>
            <span className="text-neutral-500">Expert instructors</span>
          </div>
        </div>
      </div>
    </section>
  );
}
