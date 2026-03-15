export default function Stats() {
  return (
    <section className="border-t border-[#262626] px-6 py-16">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-12">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-[#76b900]">50K+</span>
          <span className="text-[#a0a0a0] text-sm">Active students</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-[#76b900]">98%</span>
          <span className="text-[#a0a0a0] text-sm">Completion rate</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-[#76b900]">200+</span>
          <span className="text-[#a0a0a0] text-sm">Expert instructors</span>
        </div>
      </div>
    </section>
  );
}
