import dynamic from "next/dynamic";

const Hero = dynamic(
  () => import("@/components/ai-generated/Hero"),
  { ssr: false }
);

export default function ProjectFlowPage() {
  return (
    <main className="min-h-screen">
      <Hero />
    </main>
  );
}
