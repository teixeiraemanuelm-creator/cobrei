import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0B1736 0%, #1a2d4d 100%)" }}
    >
      <Card
        className="w-full max-w-lg mx-4 shadow-lg border-0 backdrop-blur-sm"
        style={{ background: "rgba(255,255,255,0.95)", borderRadius: "16px" }}
      >
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{ background: "rgba(16,216,118,0.1)" }}
              />
              <AlertCircle
                className="relative h-16 w-16"
                style={{ color: "#10D876" }}
              />
            </div>
          </div>

          <h1
            className="text-5xl font-bold mb-2"
            style={{ color: "#0B1736", fontFamily: "'Sora', sans-serif" }}
          >
            404
          </h1>

          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "#0B1736", fontFamily: "'Sora', sans-serif" }}
          >
            Página Não Encontrada
          </h2>

          <p
            className="mb-8 leading-relaxed"
            style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}
          >
            Desculpe, a página que você está procurando não existe.
            <br />
            Ela pode ter sido movida ou deletada.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGoHome}
              className="text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
              style={{ background: "#10D876", fontFamily: "'Sora', sans-serif" }}
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
