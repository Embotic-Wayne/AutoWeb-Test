export default function Features() {
  return (
    <section id="features" className="px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us</h2>
        <p className="text-[#a0a0a0] mb-12">All the tools you need to master new skills and achieve your goals.</p>
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl bg-[#1a1a1a] border border-[#262626] p-6 flex flex-col items-start">
            <div className="flex flex-col items-center mb-4">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-full bg-[#76b900] text-[#1a1a1a] text-2xl">
                <span className="font-bold">📚</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Interactive Courses</h3>
              <p className="text-[#a0a0a0] text-sm flex-grow">Engage with hands-on projects and real-world exercises that reinforce your learning.</p>
            </div>
            <div className="flex flex-col items-center mb-4">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-full bg-[#76b900] text-[#1a1a1a] text-2xl">
                <span className="font-bold">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Community Learning</h3>
              <p className="text-[#a0a0a0] text-sm flex-grow">Connect with peers, join study groups, and collaborate on projects together.</p>
            </div>
            <div className="flex flex-col items-center mb-4">
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-full bg-[#76b900] text-[#1a1a1a] text-2xl">
                <span className="font-bold">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2">Verified Certificates</h3>
              <p className="text-[#a0a0a0] text-sm flex-grow">Earn industry-recognized certificates to showcase your achievements.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
