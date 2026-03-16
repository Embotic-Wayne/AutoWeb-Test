export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Exclusively Represented
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">Dog.com</h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-500">Exclusive representation by Matthew Lifschultz</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">Make an Offer</button>
            <button className="rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">Visit Altcha.org</button>
          </div>
          <div className="mt-12 flex items-center gap-4 justify-center">
            <span className="rounded-full border border-neutral-200 bg-neutral-100 px-4 py-2 text-xs text-neutral-600">Protected by <a href="https://altcha.org/" className="text-green-600 hover:underline">ALTCHA</a></span>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-100 p-2 w-full max-w-md text-center">
              <span className="text-xl text-neutral-500">⭐</span>
            </div>
            <p className="text-neutral-500 text-sm">Protected by ALTCHA</p>
          </div>
          <img src="https://www.dog.com/img/landing_themes/category/backgrounds/Pets%20&%20Animals.jpg" alt="Dog.com background" className="w-full h-64 object-cover rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
