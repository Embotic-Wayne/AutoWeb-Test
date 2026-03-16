import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Hero = dynamic(
  () => import("@/components/ai-generated/Hero").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="py-12">
        <p className="text-neutral-400">Loading hero…</p>
      </section>
    ),
  }
);

const Stats = dynamic(
  () => import("@/components/ai-generated/Stats").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="py-12">
        <p className="text-neutral-400">Loading stats…</p>
      </section>
    ),
  }
);

const Features = dynamic(
  () => import("@/components/ai-generated/Features").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="py-12">
        <p className="text-neutral-400">Loading features…</p>
      </section>
    ),
  }
);

const Courses = dynamic(
  () => import("@/components/ai-generated/Courses").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="py-12">
        <p className="text-neutral-400">Loading courses…</p>
      </section>
    ),
  }
);

const Pricing = dynamic(
  () => import("@/components/ai-generated/Pricing").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="py-12">
        <p className="text-neutral-400">Loading pricing…</p>
      </section>
    ),
  }
);

const CTA = dynamic(
  () => import("@/components/ai-generated/CTA").then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <section className="py-12">
        <p className="text-neutral-400">Loading CTA…</p>
      </section>
    ),
  }
);

export default function ProjectFlowPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Courses />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
