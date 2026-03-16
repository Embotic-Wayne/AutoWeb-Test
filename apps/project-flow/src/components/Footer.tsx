export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-neutral-900"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-xs text-white">
            &#x1F393;
          </span>
          Learnify
        </a>
        <nav className="flex items-center gap-8">
          <a
            href="#courses"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Courses
          </a>
          <a
            href="#features"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Pricing
          </a>
          <a
            href="/about"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            About
          </a>
        </nav>
      </div>
      <p className="mt-8 text-center text-sm text-neutral-400">
        &copy; 2026 Learnify. All rights reserved.
      </p>
    </footer>
  );
}
