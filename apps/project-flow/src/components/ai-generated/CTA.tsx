export default function CTA() {
  return (
    <section className="bg-neutral-900 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Transform Your Career</h2>
        <p className="mt-4 text-neutral-400">Join thousands of learners who have successfully advanced their careers</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="/signup" className="rounded-full bg-white text-neutral-900 px-6 py-3 text-sm font-medium hover:bg-neutral-50 transition-colors">
            Get Started Free
          </a>
          <a href="/courses" className="rounded-full border border-neutral-600 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-50 transition-colors">
            Explore Courses
          </a>
        </div>
      </div>
    </section>
  );
}
