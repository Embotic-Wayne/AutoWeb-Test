export default function Stats() {
  const stats = [
    { value: "50K+", label: "Active students", sub: "learning daily" },
    { value: "200+", label: "Expert instructors", sub: "across disciplines" },
    { value: "98%", label: "Completion rate", sub: "industry leading" },
    { value: "4.9", label: "Average rating", sub: "from learners" },
  ];

  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-3xl font-bold text-neutral-900">{s.value}</div>
            <div className="mt-1 text-sm font-semibold text-neutral-900">
              {s.label}
            </div>
            <div className="text-sm text-neutral-400">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
