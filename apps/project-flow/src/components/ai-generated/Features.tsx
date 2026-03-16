export default function Features() {
  const features = [
    {
      icon: "\u{1F4CB}",
      title: "Interactive Courses",
      description:
        "Engage with hands-on projects and real-world exercises that reinforce your learning.",
    },
    {
      icon: "\u{1F465}",
      title: "Community Learning",
      description:
        "Connect with peers, join study groups, and collaborate on projects together.",
    },
    {
      icon: "\u{2B07}",
      title: "Verified Certificates",
      description:
        "Earn industry-recognized certificates to showcase your achievements.",
    },
  ];

  return (
    <section
      id="features"
      className="border-b border-neutral-200 bg-white px-6 py-20"
    >
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
          Everything you need to succeed
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
          Our platform provides all the tools and resources you need to master
          new skills and achieve your goals.
        </p>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-neutral-200 bg-white p-8 text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-xl shadow-sm">
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-neutral-900">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
