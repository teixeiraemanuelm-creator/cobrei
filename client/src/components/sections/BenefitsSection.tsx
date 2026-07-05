/**
 * BenefitsSection – Seção 4
 * Design: Cards premium em grid assimétrico
 * Animação: stagger reveal com hover elevation
 */
import { TrendingUp, Clock, BarChart2, Bot, Shield, Smartphone } from "lucide-react";

const BENEFITS = [
  {
    icon: TrendingUp,
    emoji: "💸",
    title: "Receba mais",
    description:
      "Aumente sua taxa de recebimento com lembretes automáticos e Pix na hora certa. Clientes pagam mais quando é fácil pagar.",
    highlight: true,
    color: "#10D876",
  },
  {
    icon: Clock,
    emoji: "⏱",
    title: "Economize tempo",
    description:
      "Pare de cobrar no boca a boca, por telefone ou mensagem manual. Automatize e libere horas do seu dia.",
    highlight: false,
    color: "#0B1736",
  },
  {
    icon: BarChart2,
    emoji: "📊",
    title: "Controle total",
    description:
      "Acompanhe pagamentos, inadimplência e recebimentos em tempo real. Tudo em um painel simples e claro.",
    highlight: false,
    color: "#0B1736",
  },
  {
    icon: Bot,
    emoji: "🤖",
    title: "Automação inteligente",
    description:
      "Lembretes antes do vencimento, cobranças no dia e confirmações automáticas. Sem você precisar fazer nada.",
    highlight: true,
    color: "#10D876",
  },
  {
    icon: Shield,
    emoji: "🔒",
    title: "Segurança LGPD",
    description:
      "Dados dos seus clientes protegidos com criptografia e em conformidade com a Lei Geral de Proteção de Dados.",
    highlight: false,
    color: "#0B1736",
  },
  {
    icon: Smartphone,
    emoji: "📱",
    title: "WhatsApp nativo",
    description:
      "Seus clientes recebem no app que já usam. Sem instalar nada, sem criar conta. Só clicar e pagar.",
    highlight: false,
    color: "#0B1736",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="beneficios"
      className="py-24"
      style={{ background: "#F5F7FA" }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="reveal">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
              style={{
                background: "rgba(16,216,118,0.1)",
                color: "#10D876",
                border: "1px solid rgba(16,216,118,0.2)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              BENEFÍCIOS
            </div>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#0B1736]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Tudo que você precisa
              <br />
              para receber mais.
            </h2>
          </div>
          <p
            className="text-gray-500 max-w-xs text-base reveal"
            style={{ fontFamily: "'Inter', sans-serif", transitionDelay: "100ms" }}
          >
            Desenvolvido para quem cobra mensalmente e quer automatizar sem
            complicar.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="reveal card-hover"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="p-7 rounded-2xl h-full relative overflow-hidden"
                  style={{
                    background: benefit.highlight ? "#0B1736" : "white",
                    border: benefit.highlight
                      ? "none"
                      : "1px solid rgba(11,23,54,0.07)",
                    boxShadow: benefit.highlight
                      ? "0 20px 60px rgba(11,23,54,0.3)"
                      : "0 4px 24px rgba(11,23,54,0.06)",
                  }}
                >
                  {/* Background decoration for highlighted cards */}
                  {benefit.highlight && (
                    <div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                      style={{ background: "#10D876", filter: "blur(40px)", transform: "translate(20%, -20%)" }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-xl"
                    style={{
                      background: benefit.highlight
                        ? "rgba(16,216,118,0.2)"
                        : "rgba(11,23,54,0.06)",
                    }}
                  >
                    {benefit.emoji}
                  </div>

                  {/* Content */}
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      color: benefit.highlight ? "white" : "#0B1736",
                    }}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: benefit.highlight ? "rgba(255,255,255,0.65)" : "#6b7280",
                    }}
                  >
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
