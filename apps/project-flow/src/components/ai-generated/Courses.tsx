export default function Courses() {
  const courses = [
    {
      title: "Web Development Bootcamp",
      description:
        "Master HTML, CSS, JavaScript, and React with hands-on projects.",
      tags: [
        { label: "Development", accent: false },
        { label: "Beginner", accent: false },
      ],
      weeks: 12,
      students: "15,400",
      rating: "4.9",
    },
    {
      title: "Data Science Fundamentals",
      description:
        "Learn Python, statistics, and machine learning from scratch.",
      tags: [
        { label: "Data Science", accent: true },
        { label: "Intermediate", accent: false },
      ],
      weeks: 10,
      students: "12,300",
      rating: "4.8",
    },
    {
      title: "UX/UI Design Mastery",
      description:
        "Create stunning user experiences with modern design principles.",
      tags: [
        { label: "Design", accent: true },
        { label: "All Levels", accent: false },
      ],
      weeks: 8,
      students: "9,800",
      rating: "4.9",
    },
  ];

  return (
    <section id="courses" className="border-b border-neutral-200 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">
              Popular Courses
            </h2>
            <p className="mt-2 text-neutral-500">
              Start your learning journey with our most loved courses
            </p>
          </div>
          <a
            href="/courses"
            className="hidden items-center gap-1 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors sm:inline-flex"
          >
            View all courses &rarr;
          </a>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {courses.map((c) => (
            <div
              key={c.title}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
            >
              <div className="h-48 w-full bg-neutral-100" />
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t.label}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        t.accent
                          ? "bg-green-50 text-green-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-lg font-bold text-neutral-900">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {c.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    &#x1F551; {c.weeks} weeks
                  </span>
                  <span className="flex items-center gap-1">
                    &#x1F464; {c.students}
                  </span>
                  <span className="flex items-center gap-1 text-orange-500 font-medium">
                    &#x2B50; {c.rating}
                  </span>
                </div>
                <a
                  href="/enroll"
                  className="mt-5 block w-full rounded-full bg-neutral-900 py-2.5 text-center text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                >
                  Enroll Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
