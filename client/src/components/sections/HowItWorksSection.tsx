/**
 * HowItWorksSection – Seção 3
 * Design: 4 etapas em layout horizontal com ícones e linha conectora
 * Animação: stagger reveal
 */
import { Users, FileText, MessageCircle, BarChart3 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Users,
    title: "Cadastre seus clientes",
    description:
      "Importe ou cadastre seus clientes em segundos. Nome, telefone e valor da mensalidade.",
    color: "#10D876",
  },
  {
    number: "02",
    icon: FileText,
    title: "Crie suas cobranças",
    description:
      "Defina o valor, a data de vencimento e a recorrência. Cobrei cuida do resto.",
    color: "#06b06a",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Cobrei envia automaticamente",
    description:
      "Lembretes e cobranças com Pix chegam direto no WhatsApp do seu cliente.",
    color: "#0B1736",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Você acompanha tudo",
    description:
      "Receba notificações de pagamento e veja seu painel em tempo real.",
    color: "#1a2d5a",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-white" aria-labelledby="how-it-works-title">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(16,216,118,0.1)",
              color: "#10D876",
              border: "1px solid rgba(16,216,118,0.2)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            COMO FUNCIONA
          </div>
          <h2
            id="how-it-works-title"
            className="text-3xl md:text-4xl font-bold text-[#0B1736] mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Simples como deve ser
          </h2>
          <p
            className="text-gray-500 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Em menos de 5 minutos você já está enviando cobranças automáticas
            pelo WhatsApp.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop only) */}
          <div
            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px"
            style={{
              background:
                "linear-gradient(90deg, #10D876, #06b06a, #0B1736, #1a2d5a)",
              opacity: 0.3,
            }}
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="reveal card-hover"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div
                  className="relative p-6 rounded-2xl h-full"
                  style={{
                    background: i % 2 === 0 ? "white" : "#F5F7FA",
                    border: "1px solid rgba(11,23,54,0.07)",
                    boxShadow: "0 4px 24px rgba(11,23,54,0.06)",
                  }}
                >
                  {/* Step number */}
                  <div
                    className="text-xs font-bold mb-4 tracking-widest"
                    style={{ color: step.color, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10"
                    style={{ background: `${step.color}18` }}
                  >
                    <Icon size={22} color={step.color} />
                  </div>

                  {/* Content */}
                  <h3
                    className="text-base font-bold text-[#0B1736] mb-2"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm text-gray-500 leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.description}
                  </p>

                  {/* Connector dot (desktop) */}
                  <div
                    className="hidden lg:block absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                    style={{ background: step.color, boxShadow: `0 0 0 4px ${step.color}30` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
