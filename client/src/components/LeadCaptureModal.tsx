import { useState } from "react";
import { X, Mail, Phone, CheckCircle2 } from "lucide-react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) return;

    setIsLoading(true);
    try {
      // TODO: Integrar com API de captura de leads (Mailchimp, RD Station, etc)
      console.log("Lead capturado:", { email, phone });
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
        setEmail("");
        setPhone("");
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao capturar lead:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#10D876] to-[#06d068] p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                Teste grátis por 7 dias
              </h2>
              <p className="text-green-50 text-sm mt-1">Sem cartão de crédito necessário</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Fechar modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0B1736] mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#10D876] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-semibold text-[#0B1736] mb-2">
                  WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#10D876] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !phone}
                className="w-full bg-gradient-to-r from-[#10D876] to-[#06d068] text-[#0B1736] font-bold py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {isLoading ? "Processando..." : "Começar teste grátis"}
              </button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                Ao clicar, você concorda com nossos{" "}
                <a href="#" className="text-[#10D876] hover:underline">
                  Termos de Serviço
                </a>
              </p>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle2 className="text-[#10D876]" size={40} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0B1736] mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                Sucesso!
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                Verifique seu e-mail para começar seu teste grátis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
