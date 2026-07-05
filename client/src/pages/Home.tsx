/**
 * Home – Landing Page do Cobrei
 * Design: Conversational Tech — Neo-SaaS com influência de product-led growth
 * Seções: Hero → Prova Social → Como Funciona → Benefícios → Dashboard → Planos → CTA + Footer
 */
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import DashboardSection from "@/components/sections/DashboardSection";
import PricingSection from "@/components/sections/PricingSection";
import CtaSection from "@/components/sections/CtaSection";
import RevealWrapper from "@/components/RevealWrapper";

export default function Home() {
  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    const revealEls = document.querySelectorAll(".reveal");
    revealEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <RevealWrapper />
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofSection />
        <HowItWorksSection />
        <BenefitsSection />
        <DashboardSection />
        <PricingSection />
        <CtaSection />
      </main>
    </div>
  );
}
