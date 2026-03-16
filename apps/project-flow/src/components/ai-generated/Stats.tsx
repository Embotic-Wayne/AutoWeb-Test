export default function Stats() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Active Students</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900">50,000+</p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Expert Instructors</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900">200+</p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Completion Rate</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900">98%</p>
        </div>
        <div className="text-center">
          <p className="text-neutral-500 text-sm">Courses Available</p>
          <p className="mt-1 text-3xl font-bold text-neutral-900">200+</p>
        </div>
      </div>
    </section>
  );
}
