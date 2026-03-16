"use client";

import { useViewMode } from "./context/ViewModeContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import PopularCourses from "./components/PopularCourses";
import Pricing from "./components/Pricing";
import Reviews from "./components/Reviews";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  const { isAdvanced } = useViewMode();

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <PopularCourses />
        {isAdvanced && <Pricing />}
        {isAdvanced && <Reviews />}
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
