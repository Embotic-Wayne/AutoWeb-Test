export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2 text-lg font-bold text-neutral-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-xs text-white">
            &#x1F393;
          </span>
          Learnify
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#courses" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Courses
          </a>
          <a href="#features" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Pricing
          </a>
          <a href="#about" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center rounded-lg border border-neutral-200 sm:flex">
            <button className="rounded-l-lg bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white">
              Before
            </button>
            <button className="rounded-r-lg bg-white px-4 py-1.5 text-xs font-medium text-neutral-600">
              After
            </button>
          </div>
          <a href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            Log in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
