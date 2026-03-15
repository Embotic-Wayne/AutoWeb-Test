import dynamic from "next/dynamic";

const Hero = dynamic(
  () => import("@/components/ai-generated/Hero").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="py-12">
        <p className="text-gray-500">Loading hero…</p>
      </section>
    ),
  }
);

export default function ProjectFlowPage() {
  return (
    <main className="min-h-screen p-8">
      <Hero />
      <p className="mt-6 text-sm text-gray-500">
        B2B SaaS landing page. UI driven by dynamic-config.json and ai-generated components.
      </p>
    </main>
  );
}
