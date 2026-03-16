"use client";

import Link from "next/link";

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const courses = [
  {
    category: "Development",
    level: "Beginner",
    title: "Web Development Bootcamp",
    description:
      "Master HTML, CSS, JavaScript, and React with hands-on projects.",
    duration: "12 weeks",
    students: "15,400",
    rating: "4.9",
  },
  {
    category: "Data Science",
    level: "Intermediate",
    title: "Data Science Fundamentals",
    description:
      "Learn Python, statistics, and machine learning from scratch.",
    duration: "10 weeks",
    students: "12,300",
    rating: "4.8",
  },
  {
    category: "Design",
    level: "All Levels",
    title: "UX/UI Design Mastery",
    description:
      "Create stunning user experiences with modern design principles.",
    duration: "8 weeks",
    students: "9,800",
    rating: "4.9",
  },
];

export default function PopularCourses() {
  return (
    <section id="courses" className="border-b border-neutral-200 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-4xl font-bold tracking-tight text-neutral-900">
              Popular Courses
            </h2>
            <p className="text-lg text-neutral-600">
              Start your learning journey with our most loved courses
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 self-start rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
          >
            View all courses
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.title}
              className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[4/3] bg-neutral-200" />
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                    {course.category}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                    {course.level}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-900">
                  {course.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-neutral-600">
                  {course.description}
                </p>
                <div className="mb-4 flex items-center gap-4 text-sm text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4" />
                    {course.students}
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-600">
                    <StarIcon className="h-4 w-4" />
                    {course.rating}
                  </span>
                </div>
                <Link
                  href="/enroll"
                  className="block w-full rounded-lg bg-neutral-900 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Enroll Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
