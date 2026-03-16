"use client";

function BookIcon({ className }: { className?: string }) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h8" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CertificateIcon({ className }: { className?: string }) {
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
      <path d="M12 15v2" />
      <path d="M12 6a4 4 0 0 0-4 4v2" />
      <path d="M4 14v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2" />
      <path d="M8 10h8" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m9 18 3 3 3-3" />
    </svg>
  );
}

const features = [
  {
    icon: BookIcon,
    title: "Interactive Courses",
    description:
      "Engage with hands-on projects and real-world exercises that reinforce your learning.",
  },
  {
    icon: UsersIcon,
    title: "Community Learning",
    description:
      "Connect with peers, join study groups, and collaborate on projects together.",
  },
  {
    icon: CertificateIcon,
    title: "Verified Certificates",
    description:
      "Earn industry-recognized certificates to showcase your achievements.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-b border-blue-100 bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-neutral-600">
            Our platform provides all the tools and resources you need to master new skills and achieve your goals.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-blue-100 bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-blue-200 bg-blue-50">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-neutral-900">
                {title}
              </h3>
              <p className="text-neutral-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
