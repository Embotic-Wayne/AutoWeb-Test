export default function Courses() {
  return (
    <section id="courses" className="px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Popular Courses</h2>
        <p className="text-[#a0a0a0] mb-12">Start your learning journey with our most loved courses</p>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl bg-[#1a1a1a] border border-[#262626] p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Web Development Bootcamp</h3>
            <p className="text-[#a0a0a0] mb-4">Master HTML, CSS, JavaScript, and React with hands-on projects.</p>
            <div className="flex justify-between items-center mt-6">
              <span className="text-[#76b900] font-medium">12 weeks15,4004.9</span>
              <a href="/enroll" className="text-[#76b900] hover:underline">Enroll Now</a>
            </div>
          </div>
          <div className="rounded-xl bg-[#1a1a1a] border border-[#262626] p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Data Science Fundamentals</h3>
            <p className="text-[#a0a0a0] mb-4">Learn Python, statistics, and machine learning from scratch.</p>
            <div className="flex justify-between items-center mt-6">
              <span className="text-[#76b900] font-medium">10 weeks12,3004.8</span>
              <a href="/enroll" className="text-[#76b900] hover:underline">Enroll Now</a>
            </div>
          </div>
          <div className="rounded-xl bg-[#1a1a1a] border border-[#262626] p-6 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">UX/UI Design Mastery</h3>
            <p className="text-[#a0a0a0] mb-4">Create stunning user experiences with modern design principles.</p>
            <div className="flex justify-between items-center mt-6">
              <span className="text-[#76b900] font-medium">8 weeks9,8004.9</span>
              <a href="/enroll" className="text-[#76b900] hover:underline">Enroll Now</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
