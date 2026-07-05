/**
 * PricingSection – Seção 6
 * Design: 3 planos com destaque no Profissional
 * Animação: stagger reveal, hover elevation
 */
import { Check, Star } from "lucide-react";

const PLANS = [
  {
    name: "Básico",
    price: "49",
    description: "Ideal para autônomos e pequenos negócios.",
    features: [
      "Até 50 clientes",
      "Cobranças via WhatsApp",
      "Pix automático",
      "Painel básico",
      "Suporte por e-mail",
    ],
    popular: false,
    cta: "Começar grátis",
  },
  {
    name: "Profissional",
    price: "99",
    description: "O plano preferido de academias, clínicas e escolas.",
    features: [
      "Clientes ilimitados",
      "Cobranças via WhatsApp",
      "Pix automático + QR Code",
      "Painel completo + relatórios",
      "Lembretes personalizados",
      "Integração com sistemas",
      "Suporte prioritário",
    ],
    popular: true,
    cta: "Começar grátis",
  },
  {
    name: "Empresarial",
    price: "199",
    description: "Para empresas com múltiplas unidades e alto volume.",
    features: [
      "Tudo do Profissional",
      "Múltiplas contas",
      "API de integração",
      "Gestor de conta dedicado",
      "SLA garantido",
      "Treinamento da equipe",
    ],
    popular: false,
    cta: "Falar com vendas",
  },
];

const TRUST_BADGES = [
  { icon: "🔒", text: "Sem cartão de crédito" },
  { icon: "✅", text: "Cancelamento fácil" },
  { icon: "🛡️", text: "Dados protegidos pela LGPD" },
];

export default function PricingSection() {
  return (
    <section
      id="planos"
      className="py-24"
      style={{ background: "#F5F7FA" }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{
              background: "rgba(16,216,118,0.1)",
              color: "#10D876",
              border: "1px solid rgba(16,216,118,0.2)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            PLANOS E PREÇOS
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0B1736] mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Comece grátis.
            <br />
            Pague só quando gostar.
          </h2>
          <p
            className="text-gray-500 text-lg max-w-lg mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            7 dias grátis em qualquer plano. Sem cartão de crédito.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className="reveal card-hover"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="relative p-7 rounded-2xl h-full flex flex-col"
                style={{
                  background: plan.popular ? "#0B1736" : "white",
                  border: plan.popular
                    ? "2px solid #10D876"
                    : "1px solid rgba(11,23,54,0.08)",
                  boxShadow: plan.popular
                    ? "0 30px 80px rgba(11,23,54,0.3)"
                    : "0 4px 24px rgba(11,23,54,0.06)",
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: "#10D876",
                      color: "#0B1736",
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    <Star size={11} fill="#0B1736" />
                    Mais Popular
                  </div>
                )}

                {/* Plan name */}
                <div
                  className="text-sm font-semibold mb-2"
                  style={{
                    color: plan.popular ? "#10D876" : "#10D876",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {plan.name}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: plan.popular ? "rgba(255,255,255,0.6)" : "#9ca3af" }}
                  >
                    R$
                  </span>
                  <span
                    className="text-5xl font-bold"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      color: plan.popular ? "white" : "#0B1736",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: plan.popular ? "rgba(255,255,255,0.5)" : "#9ca3af" }}
                  >
                    /mês
                  </span>
                </div>

                {/* Description */}
                <p
                  className="text-sm mb-6"
                  style={{
                    color: plan.popular ? "rgba(255,255,255,0.55)" : "#6b7280",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: plan.popular
                            ? "rgba(16,216,118,0.2)"
                            : "rgba(16,216,118,0.12)",
                        }}
                      >
                        <Check size={11} color="#10D876" strokeWidth={3} />
                      </div>
                      <span
                        className="text-sm"
                        style={{
                          color: plan.popular ? "rgba(255,255,255,0.75)" : "#374151",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.popular ? (
                  <button className="btn-cobrei w-full justify-center text-sm py-3.5">
                    {plan.cta}
                  </button>
                ) : (
                  <button
                    className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-150"
                    style={{
                      background: "transparent",
                      border: "1.5px solid rgba(11,23,54,0.15)",
                      color: "#0B1736",
                      fontFamily: "'Sora', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLButtonElement).style.background = "rgba(11,23,54,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 reveal">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.text}
              className="flex items-center gap-2 text-sm text-gray-500"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
