export default function CTA() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to transform your career?</h2>
        <p className="text-[#a0a0a0] mb-10">Join thousands of learners who are already transforming their careers. Start with a free trial and experience the difference.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/signup" className="rounded-lg bg-[#76b900] px-6 py-3 text-sm font-medium text-black hover:bg-[#8ed100] transition-colors">Get Started Free</a>
          <a href="/contact" className="rounded-lg border border-[#76b900] bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-[#76b900] hover:bg-[#1a1a1a] transition-colors">Talk to Sales</a>
        </div>
      </div>
    </section>
  );
}
