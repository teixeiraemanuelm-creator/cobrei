/**
 * HeroSection – Seção 1
 * Design: Conversational Tech — Assimétrico, mockup WhatsApp + dashboard
 * Layout: Texto esquerda (55%) + Mockup direita (45%)
 * Animações: slide-in, float, bolha WhatsApp animada
 */
import { useState, useEffect, useRef } from "react";
import { CheckCircle, Play, ArrowRight } from "lucide-react";

const WHATSAPP_MESSAGES = [
  { id: 1, type: "received", text: "Olá, João! 👋\n\nSua mensalidade de R$150,00 vence hoje.", delay: 0 },
  { id: 2, type: "received", text: "Segue seu Pix para pagamento:", delay: 800 },
  { id: 3, type: "pix", text: "Pagar com Pix", delay: 1600 },
  { id: 4, type: "confirmed", text: "✅ Pagamento confirmado.\nObrigado!", delay: 3200 },
];

function WhatsAppMockup() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const cycleRef = useRef(0);

  const runAnimation = () => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = ++cycleRef.current;

    WHATSAPP_MESSAGES.forEach((msg) => {
      timers.push(
        setTimeout(() => {
          if (cycleRef.current !== cycle) return;
          setShowTyping(true);
        }, msg.delay)
      );
      timers.push(
        setTimeout(() => {
          if (cycleRef.current !== cycle) return;
          setShowTyping(false);
          setVisibleMessages((prev) => [...prev, msg.id]);
        }, msg.delay + 600)
      );
    });

    // Reset after full sequence
    timers.push(
      setTimeout(() => {
        if (cycleRef.current !== cycle) return;
        setVisibleMessages([]);
        setShowTyping(false);
        setTimeout(runAnimation, 800);
      }, 8000)
    );

    return () => timers.forEach(clearTimeout);
  };

  useEffect(() => {
    const cleanup = runAnimation();
    return cleanup;
  }, []);


  return (
    <div
      className="relative mx-auto"
      style={{
        width: "260px",
        background: "#ECE5DD",
        borderRadius: "32px",
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(11,23,54,0.35), 0 0 0 8px rgba(11,23,54,0.08)",
        border: "6px solid #1a1a1a",
      }}
    >
      {/* Phone notch */}
      <div style={{ background: "#1a1a1a", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "80px", height: "10px", background: "#333", borderRadius: "10px" }} />
      </div>

      {/* WhatsApp header */}
      <div
        style={{
          background: "#075E54",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#10D876",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#075E54",
          }}
        >
          C
        </div>
        <div>
          <div style={{ color: "white", fontSize: "13px", fontWeight: "600", fontFamily: "'Sora', sans-serif" }}>
            Cobrei
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}>online</div>
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          background: "#ECE5DD",
          padding: "12px 10px",
          minHeight: "280px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {WHATSAPP_MESSAGES.map((msg) =>
          visibleMessages.includes(msg.id) ? (
            <div
              key={msg.id}
              style={{
                animation: "scaleIn 300ms cubic-bezier(0.23,1,0.32,1) forwards",
                alignSelf: "flex-start",
              }}
            >
              {msg.type === "pix" ? (
                <div
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    padding: "12px",
                    maxWidth: "220px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "#666", marginBottom: "8px" }}>
                    Pagamento via Pix
                  </div>
                  <div
                    style={{
                      background: "#10D876",
                      borderRadius: "10px",
                      padding: "10px 16px",
                      textAlign: "center",
                      color: "#0B1736",
                      fontWeight: "700",
                      fontSize: "13px",
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    💳 Pagar R$150,00
                  </div>
                  <div style={{ fontSize: "10px", color: "#999", marginTop: "6px", textAlign: "center" }}>
                    Copia e Cola disponível
                  </div>
                </div>
              ) : msg.type === "confirmed" ? (
                <div
                  style={{
                    background: "#d4edda",
                    borderRadius: "14px 14px 14px 4px",
                    padding: "10px 14px",
                    maxWidth: "220px",
                    fontSize: "13px",
                    color: "#155724",
                    whiteSpace: "pre-line",
                    fontWeight: "600",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.text}
                </div>
              ) : (
                <div
                  style={{
                    background: "white",
                    borderRadius: "14px 14px 14px 4px",
                    padding: "10px 14px",
                    maxWidth: "220px",
                    fontSize: "13px",
                    color: "#1a1a1a",
                    whiteSpace: "pre-line",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    lineHeight: "1.5",
                  }}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ) : null
        )}

        {/* Typing indicator */}
        {showTyping && (
          <div
            style={{
              background: "white",
              borderRadius: "14px 14px 14px 4px",
              padding: "10px 14px",
              width: "60px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#999",
                  animation: `typing 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        style={{
          background: "#F0F0F0",
          padding: "8px 10px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            background: "white",
            borderRadius: "20px",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#999",
          }}
        >
          Mensagem
        </div>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#075E54",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "white", fontSize: "14px" }}>🎤</span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0B1736 0%, #1a2d5a 50%, #0d2040 100%)",
        paddingTop: "80px",
      }}
    >
      {/* Background image overlay - LCP Critical */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url('/manus-storage/cobrei-hero-bg_ac1aa1d6.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          contentVisibility: "auto",
        }}
      />

      {/* Decorative elements */}
      <div
        className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: "#10D876", filter: "blur(80px)" }}
      />
      <div
        className="absolute bottom-0 left-20 w-64 h-64 rounded-full opacity-8"
        style={{ background: "#10D876", filter: "blur(60px)" }}
      />

      <div className="container mx-auto max-w-6xl relative z-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="space-y-8 animate-slide-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(16,216,118,0.15)",
                border: "1px solid rgba(16,216,118,0.3)",
                color: "#10D876",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#10D876] animate-pulse" />
              Teste grátis por 7 dias · Sem cartão de crédito
            </div>

            {/* Headline */}
            <div>
              <h1
                className="text-4xl md:text-5xl lg:text-[52px] font-bold leading-tight text-white"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Pare de cobrar{" "}
                <span className="block">manualmente.</span>
                <span
                  className="block mt-1"
                  style={{
                    background: "linear-gradient(135deg, #10D876 0%, #06d068 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  O Cobrei recebe
                </span>
                <span className="block text-white">por você.</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p
              className="text-lg text-white/70 leading-relaxed max-w-lg"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Gere Pix, envie lembretes automáticos pelo WhatsApp e acompanhe
              seus recebimentos em tempo real.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="btn-cobrei text-base px-7 py-4 whitespace-nowrap"
                onClick={() => scrollTo("planos")}
              >
                <span>Começar grátis por 7 dias</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-white/80 hover:text-white transition-all duration-150 hover:bg-white/10"
                style={{ fontFamily: "'Sora', sans-serif", fontSize: "15px" }}
                onClick={() => scrollTo("como-funciona")}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <Play size={14} fill="white" />
                </div>
                Ver demonstração
              </button>
            </div>

            {/* Feature badges */}
            <div className="flex flex-col gap-3 pt-2">
              {[
                "Envio automático pelo WhatsApp",
                "Pix com QR Code e Copia e Cola",
                "Confirmação automática de pagamento",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,216,118,0.2)" }}
                  >
                    <CheckCircle size={12} color="#10D876" />
                  </div>
                  <span
                    className="text-sm text-white/70"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: WhatsApp mockup */}
          <div className="flex justify-center lg:justify-end animate-slide-right">
            <div className="relative">
              {/* Floating cards */}
              <div
                className="absolute -left-8 top-12 animate-float z-20"
                style={{ animationDelay: "0.5s" }}
              >
                <div
                  className="px-4 py-3 rounded-2xl text-sm font-semibold shadow-xl"
                  style={{
                    background: "white",
                    color: "#0B1736",
                    fontFamily: "'Sora', sans-serif",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                    minWidth: "160px",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#10D876] text-base">✅</span>
                    <span className="text-xs text-gray-500">Recebido agora</span>
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: "#10D876" }}
                  >
                    R$150,00
                  </div>
                </div>
              </div>

              <div
                className="absolute -right-6 bottom-20 animate-float z-20"
                style={{ animationDelay: "1s" }}
              >
                <div
                  className="px-4 py-3 rounded-2xl text-sm shadow-xl"
                  style={{
                    background: "#0B1736",
                    color: "white",
                    fontFamily: "'Sora', sans-serif",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                    minWidth: "140px",
                  }}
                >
                  <div className="text-xs text-white/60 mb-1">Inadimplência</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#10D876]">-60%</span>
                  </div>
                  <div className="text-xs text-white/50 mt-1">com Cobrei</div>
                </div>
              </div>

              <WhatsAppMockup />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
