export default function Hero() {
  return (
    <section className="px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-block rounded-full border border-[#262626] bg-[#1a1a1a] px-4 py-1.5 text-xs font-medium text-[#76b900]">Free Trial</span>
        <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white">Learn without limits, grow without boundaries.</h1>
        <p className="mt-6 text-lg leading-relaxed text-[#a0a0a0]">Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="/signup" className="rounded-lg bg-[#76b900] px-6 py-3 text-sm font-medium text-black hover:bg-[#8ed100] transition-colors">Start Learning Free</a>
          <a href="/login" className="rounded-lg border border-[#262626] bg-transparent px-6 py-3 text-sm font-medium text-white hover:border-[#76b900] hover:bg-[#1a1a1a] transition-colors">Log In</a>
        </div>
      </div>
    </section>
  );
}
