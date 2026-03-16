const stats = [
  { value: "50K+", title: "Active students", subtitle: "learning daily" },
  { value: "200+", title: "Expert instructors", subtitle: "across disciplines" },
  { value: "98%", title: "Completion rate", subtitle: "industry leading" },
  { value: "4.9", title: "Average rating", subtitle: "from learners" },
];

export default function Stats() {
  return (
    <section className="border-b border-neutral-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(({ value, title, subtitle }) => (
            <div key={title} className="text-center md:text-left">
              <div className="mb-1 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                {value}
              </div>
              <div className="mb-1 font-semibold text-neutral-900">{title}</div>
              <div className="text-sm text-neutral-500">{subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
