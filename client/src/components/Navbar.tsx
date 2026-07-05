/**
 * Cobrei Navbar
 * Design: Conversational Tech — transparente no topo, opaco ao scroll
 * Cores: Navy #0B1736 | Verde #10D876
 */
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "#0B1736", border: "1.5px solid rgba(16,216,118,0.3)" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8L12 22L16 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="rgba(16,216,118,0.15)" stroke="#10D876" strokeWidth="1.5"/>
                <path d="M7 10L10.5 13.5L17 7" stroke="#10D876" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: "'Sora', sans-serif",
                color: scrolled ? "#0B1736" : "white",
              }}
            >
              cobrei
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Como funciona", id: "como-funciona" },
              { label: "Benefícios", id: "beneficios" },
              { label: "Planos", id: "planos" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium transition-colors duration-200 hover:text-[#10D876]"
                style={{ color: scrolled ? "#0B1736" : "rgba(255,255,255,0.8)", fontFamily: "'Inter', sans-serif" }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollTo("planos")}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                color: scrolled ? "#0B1736" : "rgba(255,255,255,0.8)",
                fontFamily: "'Sora', sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = scrolled ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Entrar
            </button>
            <button
              className="btn-cobrei text-sm px-5 py-2.5"
              onClick={() => scrollTo("planos")}
            >
              Começar grátis
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <span
                className={`block h-0.5 bg-[#0B1736] transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 bg-[#0B1736] transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 bg-[#0B1736] transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
            {[
              { label: "Como funciona", id: "como-funciona" },
              { label: "Benefícios", id: "beneficios" },
              { label: "Planos", id: "planos" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left text-sm font-medium py-2 text-[#0B1736] hover:text-[#10D876] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.label}
              </button>
            ))}
            <button
              className="btn-cobrei w-full justify-center mt-2"
              onClick={() => scrollTo("planos")}
            >
              Começar grátis
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
