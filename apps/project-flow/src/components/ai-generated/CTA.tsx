export default function CTA() {
  return (
    <section className="bg-neutral-900 px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Ready to transform your career?
        </h2>
        <p className="mt-4 text-neutral-400">
          Join thousands of learners who are already building the future.
          Start with a free trial today.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/signup"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            Get started for free
          </a>
          <a
            href="/contact"
            className="rounded-full border border-neutral-600 px-6 py-3 text-sm font-medium text-white hover:border-neutral-400 transition-colors"
          >
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}
