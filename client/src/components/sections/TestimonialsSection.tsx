/**
 * TestimonialsSection – Seção de Depoimentos
 * Design: 4 cards com foto, nome, empresa e resultado
 * Acessibilidade: aria-labelledby, role="region"
 */
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Carlos Silva",
    company: "Academia FitLife",
    role: "Proprietário",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "Aumentei meus recebimentos em 40% com o Cobrei. Agora os clientes pagam automaticamente.",
    rating: 5,
  },
  {
    id: 2,
    name: "Mariana Costa",
    company: "Clínica Odontológica Smile",
    role: "Gerente Administrativo",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "Reduzimos inadimplência em 60%. O sistema de lembretes automáticos é perfeito.",
    rating: 5,
  },
  {
    id: 3,
    name: "João Pereira",
    company: "Escola de Idiomas Global",
    role: "Diretor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "Economizei 15 horas por mês com cobrança automática. Investimento que se paga sozinho.",
    rating: 5,
  },
  {
    id: 4,
    name: "Ana Martins",
    company: "Consultoria Empresarial",
    role: "Sócia-Fundadora",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "Profissional, seguro e fácil de usar. Recomendo para qualquer negócio.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="depoimentos"
      className="py-20 bg-white"
      aria-labelledby="testimonials-title"
      role="region"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{
              background: "rgba(16,216,118,0.15)",
              border: "1px solid rgba(16,216,118,0.3)",
              color: "#10D876",
              fontFamily: "'Inter', sans-serif",
            }}
            aria-hidden="true"
          >
            <span className="w-2 h-2 rounded-full bg-[#10D876]" />
            Histórias de Sucesso
          </div>

          <h2
            id="testimonials-title"
            className="text-3xl md:text-4xl font-bold text-[#0B1736] mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            O que nossos clientes dizem
          </h2>

          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Empresas de todos os tamanhos confiam no Cobrei para automatizar suas cobranças
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="reveal bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              role="article"
              aria-label={`Depoimento de ${testimonial.name}`}
            >
              {/* Card Content */}
              <div className="p-6 flex flex-col h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} de 5 estrelas`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-[#10D876] text-[#10D876]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className="text-gray-700 mb-6 flex-grow"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", lineHeight: "1.6" }}
                >
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p
                      className="font-semibold text-[#0B1736] text-sm"
                      style={{ fontFamily: "'Sora', sans-serif" }}
                    >
                      {testimonial.name}
                    </p>
                    <p
                      className="text-gray-500 text-xs"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {testimonial.role} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 reveal">
          <p
            className="text-gray-600 mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Junte-se a centenas de empresas que já automatizaram suas cobranças
          </p>
          <button
            className="btn-cobrei text-base px-8 py-4"
            onClick={() => {
              const button = document.querySelector('button[aria-label="Start free trial for 7 days"]') as HTMLButtonElement;
              if (button) button.click();
            }}
            aria-label="Start free trial"
          >
            <span>Começar teste grátis</span>
          </button>
        </div>
      </div>
    </section>
  );
}
