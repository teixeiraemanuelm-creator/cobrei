/**
 * CtaSection – Seção 7 + Footer
 * Design: Dark CTA com fundo premium + footer minimalista
 */
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* CTA Section */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: "#0B1736" }}
        aria-labelledby="cta-title"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('/manus-storage/cobrei-cta-bg_4fc36454.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Decorative glows */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-15"
          style={{ background: "#10D876", filter: "blur(100px)" }}
        />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
              style={{
                background: "rgba(16,216,118,0.15)",
                border: "1px solid rgba(16,216,118,0.3)",
                color: "#10D876",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10D876] animate-pulse" />
              Comece hoje, sem cartão de crédito
            </div>

            {/* Headline */}
            <h2
              id="cta-title"
              className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Seu próximo pagamento pode
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #10D876 0%, #06d068 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                acontecer sem você precisar cobrar.
              </span>
            </h2>

            {/* Subheadline */}
            <p
              className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Automatize suas cobranças e receba mais com menos esforço.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="btn-cobrei text-base px-8 py-4 animate-pulse-green"
                onClick={() => scrollTo("planos")}
              >
                <span>Começar gratuitamente</span>
                <ArrowRight size={18} />
              </button>
              <p
                className="text-sm text-white/40"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                7 dias grátis · Sem cartão de crédito
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-10"
        style={{ background: "#060e22", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-0">
              <img
                src="/manus-storage/file_000000001cb471f5a5bf831dd4452b00_8c94ad74.png"
                alt="Cobrei Logo"
                className="h-8 md:h-9 w-auto"
              />
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {["Termos de uso", "Privacidade", "LGPD", "Suporte"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-white/40 hover:text-white/70 transition-colors duration-150"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <p
              className="text-sm text-white/30"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              © {new Date().getFullYear()} Cobrei
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
