/**
 * SocialProofSection – Seção 2
 * Design: Números impactantes + logos de clientes
 * Animação: contador ao entrar na viewport
 */
import { useEffect, useRef } from "react";

function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  label,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 2000;
            const start = Date.now();
            const tick = () => {
              const elapsed = Date.now() - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              if (el) el.textContent = current.toLocaleString("pt-BR");
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="text-center">
      <div
        className="text-4xl md:text-5xl font-bold mb-2"
        style={{ fontFamily: "'Sora', sans-serif", color: "#0B1736" }}
      >
        {prefix}
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <div
        className="text-sm md:text-base text-gray-500 max-w-[180px] mx-auto leading-snug"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {label}
      </div>
    </div>
  );
}

const LOGOS = [
  { name: "Academia Fitness", icon: "🏋️", color: "#FF6B35" },
  { name: "Clínica Saúde+", icon: "🏥", color: "#4ECDC4" },
  { name: "Escola Educar", icon: "📚", color: "#45B7D1" },
  { name: "Studio Beleza", icon: "💄", color: "#F7B731" },
  { name: "Contábil Soluções", icon: "📊", color: "#6C5CE7" },
];

export default function SocialProofSection() {
  return (
    <section
      id="prova-social"
      className="py-20 relative overflow-hidden"
      style={{ background: "#F5F7FA" }}
      aria-labelledby="social-proof-title"
    >
      {/* Background subtle image */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url('/manus-storage/cobrei-social-proof-bg_0397ebd2.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Heading */}
        <h2
          id="social-proof-title"
          className="sr-only"
        >
          Prova Social - Números Impactantes
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 mb-16">
          <div className="reveal">
            <AnimatedCounter
              target={15}
              prefix="+R$"
              suffix=" milhões"
              label="cobrados pela plataforma"
            />
          </div>
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <AnimatedCounter
              target={2}
              prefix="+"
              suffix=" milhões"
              label="de mensagens enviadas"
            />
          </div>
          <div className="reveal" style={{ transitionDelay: "200ms" }}>
            <AnimatedCounter
              target={60}
              prefix="Até "
              suffix="%"
              label="menos inadimplência"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-12" />

        {/* Logos */}
        <div className="text-center mb-8 reveal">
          <p
            className="text-sm font-medium text-gray-400 uppercase tracking-widest"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Empresas que confiam no Cobrei
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {LOGOS.map((logo, i) => (
            <div
              key={logo.name}
              className="reveal card-hover"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-gray-100"
                style={{
                  boxShadow: "0 2px 12px rgba(11,23,54,0.06)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${logo.color}18` }}
                >
                  {logo.icon}
                </div>
                <span
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  {logo.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
