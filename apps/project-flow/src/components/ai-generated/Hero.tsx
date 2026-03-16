export default function Hero() {
  return (
    <section className="border-b border-neutral-200 bg-white px-6 py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm text-neutral-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Exclusive Representation
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-neutral-900 md:text-5xl">Dog.com</h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-500">Represented exclusively by Matthew Lifschultz</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="/signup" className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors">
              Get Started
            </a>
            <a href="/login" className="rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              Contact Sales
            </a>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <span className="text-sm text-neutral-400">Protected by</span>
            <a href="https://altcha.org/" className="ml-2 text-neutral-500 hover:underline">
              ALTCHA
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            <span className="inline-block text-xs font-medium bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">
              Available for purchase, lease, JV or partnership
            </span>
            <h2 className="mt-1 text-xl font-bold text-neutral-900">Dog.com</h2>
            <p className="mt-1 text-neutral-500">• • •</p>
            <p className="mt-1 text-neutral-400 text-sm">© 2023 Dog.com. All rights reserved.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
          <div className="h-48 bg-neutral-100 rounded-2xl"></div>
        </div>
      </div>
    </section>
  );
}
