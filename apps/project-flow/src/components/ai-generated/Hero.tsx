export default function Hero() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Learn without limits, grow without boundaries.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Access world-class education from top instructors. Master new skills, advance your career, and unlock your potential with our interactive learning platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Start learning free
          </a>
          <a href="#"
            className="inline-block px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
          >
            Watch demo
          </a>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800">
              +85%
            </p>
            <p className="text-gray-500">Active students learning daily</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800">
              200+
            </p>
            <p className="text-gray-500">Expert instructors across disciplines</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-800">
              98%
            </p>
            <p className="text-gray-500">Completion rate industry leading</p>
          </div>
        </div>
      </div>
    </section>
  );
}
