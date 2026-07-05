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
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "#0B1736", border: "1px solid rgba(16,216,118,0.3)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8L12 22L16 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="rgba(16,216,118,0.15)" stroke="#10D876" strokeWidth="1.5"/>
                  <path d="M7 10L10.5 13.5L17 7" stroke="#10D876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div
                  className="text-white font-bold text-base"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  cobrei
                </div>
                <div
                  className="text-white/40 text-xs"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Cobranças automáticas via WhatsApp e Pix.
                </div>
              </div>
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
