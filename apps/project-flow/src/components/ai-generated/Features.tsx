export default function Features() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Everything you need to succeed
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Interactive Courses</h3>
            <p className="text-gray-600">
              Hands-on projects and real-world exercises reinforce learning.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Community Learning</h3>
            <p className="text-gray-600">
              Connect with peers, join study groups, and collaborate on projects together.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Verified Certificates</h3>
            <p className="text-gray-600">
              Earn industry-recognized certificates to showcase your achievements.
            </p>
          </div>
        </div>
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <p className="text-2xl font-semibold text-blue-800">
              ✓
            </p>
            <p className="mt-2 text-gray-700">
              50,000+ students already enrolled
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <p className="text-2xl font-semibold text-blue-800">
              ✓
            </p>
            <p className="mt-2 text-gray-700">
              200+ expert instructors across disciplines
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <p className="text-2xl font-semibold text-blue-800">
              ✓
            </p>
            <p className="mt-2 text-gray-700">
              98% completion rate industry leading
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <p className="text-2xl font-semibold text-blue-800">
              ✓
            </p>
            <p className="mt-2 text-gray-700">
              4.9 average rating from learners
            </p>
          </div>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-xl font-semibold text-gray-800">
              12 weeks
            </p>
            <p className="mt-2 text-gray-600">Web Development Bootcamp</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-xl font-semibold text-gray-800">
              10 weeks
            </p>
            <p className="mt-2 text-gray-600">Data Science Fundamentals</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-xl font-semibold text-gray-800">
              8 weeks
            </p>
            <p className="mt-2 text-gray-600">UX/UI Design Mastery</p>
          </div>
        </div>
        <div className="mt-24 flex flex-col sm:flex-row gap-8 justify-center">
          <a href="#"
            className="inline-block px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
          >
            Get started for free
          </a>
          <a href="#"
            className="inline-block px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}
