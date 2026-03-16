export default function Stats() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl py-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Users</p>
            <p className="text-3xl font-bold text-neutral-900">1.2M</p>
            <p className="text-neutral-400 text-sm">Active Learners</p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Courses</p>
            <p className="text-3xl font-bold text-neutral-900">500+</p>
            <p className="text-neutral-400 text-sm">Available Programs</p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Completion Rate</p>
            <p className="text-3xl font-bold text-neutral-900">92%</p>
            <p className="text-neutral-400 text-sm">Course Completion</p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Instructors</p>
            <p className="text-3xl font-bold text-neutral-900">150+</p>
            <p className="text-neutral-400 text-sm">Expert Educators</p>
          </div>
        </div>
      </div>
    </section>
  );
}
