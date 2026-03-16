"use client";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const reviews = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    avatar: "SC",
    text: "Knowledgeable completely changed how I pick up new skills. The courses are clear, and I finished three certifications in just a few months.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    avatar: "MJ",
    text: "Best learning platform I've used. The hands-on projects and community support made it easy to stay motivated and actually finish courses.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Marketing Manager",
    avatar: "ER",
    text: "I needed to level up my digital marketing skills fast. Knowledgeable's structure and expert instructors made it straightforward and practical.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Data Analyst",
    avatar: "DP",
    text: "The data science track is outstanding. Real datasets, clear explanations, and certificates that actually mean something to employers.",
    rating: 5,
  },
  {
    name: "Amanda Foster",
    role: "Career Switcher",
    avatar: "AF",
    text: "Switched into tech thanks to Knowledgeable. The career paths are well thought out and the support from instructors and peers was incredible.",
    rating: 5,
  },
  {
    name: "James Liu",
    role: "Team Lead",
    avatar: "JL",
    text: "We use Knowledgeable for team upskilling. Great content, flexible pacing, and the admin tools make it simple to track progress.",
    rating: 5,
  },
];

function ReviewCard({
  name,
  role,
  avatar,
  text,
  rating,
}: (typeof reviews)[0]) {
  return (
    <div className="w-[340px] shrink-0 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-1 text-blue-500">
        {Array.from({ length: rating }).map((_, i) => (
          <StarIcon key={i} className="h-4 w-4" />
        ))}
      </div>
      <p className="mb-6 text-sm leading-relaxed text-neutral-700">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{name}</p>
          <p className="text-xs text-neutral-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Reviews() {
  const duplicated = [...reviews, ...reviews];

  return (
    <section className="border-b border-blue-100 bg-blue-50/30 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            What learners are saying
          </h2>
          <p className="text-neutral-600">
            Join thousands of students who are already achieving their goals.
          </p>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-6 animate-marquee">
          {duplicated.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
}
