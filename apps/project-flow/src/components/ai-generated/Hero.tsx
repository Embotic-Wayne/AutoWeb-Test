export default function Hero() {
  return (
    <section className="py-12 text-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Learn without limits, grow without boundaries.</h1>
        <p className="text-lg text-gray-600 mb-6"></p>
        <a href="/courses" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition">
          Start learning free
        </a>
        <a href="#" className="ml-4 text-indigo-600 hover:underline">Watch demo</a>
      </div>
    </section>
  );
}