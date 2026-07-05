/**
 * DashboardSection – Seção 5
 * Design: Mockup de dashboard premium com gráfico Recharts
 * Estilo: Software premium, dark sidebar + light main area
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const CHART_DATA = [
  { day: "Seg", valor: 1200 },
  { day: "Ter", valor: 2100 },
  { day: "Qua", valor: 800 },
  { day: "Qui", valor: 1800 },
  { day: "Sex", valor: 2350 },
  { day: "Sáb", valor: 1600 },
  { day: "Dom", valor: 900 },
];

const PAYMENTS = [
  { name: "Academia Fitness", value: "R$350,00", status: "paid", date: "Hoje" },
  { name: "Clínica Saúde+", value: "R$280,00", status: "paid", date: "Hoje" },
  { name: "Escola Educar", value: "R$520,00", status: "pending", date: "Amanhã" },
  { name: "Studio Beleza", value: "R$180,00", status: "overdue", date: "3 dias" },
  { name: "Contábil Soluções", value: "R$420,00", status: "pending", date: "5 dias" },
];

const STATUS_CONFIG = {
  paid: { label: "Pago", color: "#10D876", bg: "rgba(16,216,118,0.1)", icon: CheckCircle2 },
  pending: { label: "A vencer", color: "#F59E0B", bg: "rgba(245,158,11,0.1)", icon: Clock },
  overdue: { label: "Vencida", color: "#EF4444", bg: "rgba(239,68,68,0.1)", icon: AlertCircle },
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-sm"
        style={{
          background: "#0B1736",
          color: "white",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div className="text-xs text-white/60 mb-1">{label}</div>
        <div className="font-bold text-[#10D876]">
          R${payload[0].value.toLocaleString("pt-BR")}
        </div>
      </div>
    );
  }
  return null;
}

export default function DashboardSection() {
  return (
    <section id="dashboard" className="py-24 bg-white overflow-hidden">
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
            PAINEL DE CONTROLE
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0B1736] mb-4"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Tudo sob controle,
            <br />
            em tempo real.
          </h2>
          <p
            className="text-gray-500 text-lg max-w-lg mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Veja quem pagou, quem está devendo e quanto você vai receber — tudo
            em um único painel.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div
          className="reveal rounded-3xl overflow-hidden"
          style={{
            boxShadow: "0 40px 100px rgba(11,23,54,0.2), 0 0 0 1px rgba(11,23,54,0.08)",
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ background: "#1e2a4a", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div
              className="flex-1 mx-4 px-3 py-1 rounded-lg text-xs text-white/40"
              style={{ background: "rgba(255,255,255,0.05)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              app.cobrei.com.br/dashboard
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex" style={{ background: "#F5F7FA", minHeight: "500px" }}>
            {/* Sidebar */}
            <div
              className="hidden md:flex flex-col w-56 p-4 gap-1"
              style={{ background: "#0B1736" }}
            >
              {/* Logo */}
              <div className="flex items-center gap-0 px-3 py-3 mb-4">
                <img
                  src="/manus-storage/file_000000001cb471f5a5bf831dd4452b00_8c94ad74.png"
                  alt="Cobrei Logo"
                  className="h-6 w-auto"
                />
              </div>

              {[
                { icon: "📊", label: "Dashboard", active: true },
                { icon: "👥", label: "Clientes", active: false },
                { icon: "💳", label: "Cobranças", active: false },
                { icon: "📱", label: "WhatsApp", active: false },
                { icon: "⚙️", label: "Configurações", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm"
                  style={{
                    background: item.active ? "rgba(16,216,118,0.15)" : "transparent",
                    color: item.active ? "#10D876" : "rgba(255,255,255,0.5)",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: item.active ? "600" : "400",
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-5 md:p-6 overflow-hidden">
              {/* Top stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: "Recebido hoje",
                    value: "R$2.350",
                    change: "+12%",
                    positive: true,
                    icon: "✅",
                  },
                  {
                    label: "A receber",
                    value: "R$8.430",
                    change: "23 cobranças",
                    positive: true,
                    icon: "⏳",
                  },
                  {
                    label: "Inadimplentes",
                    value: "R$3.120",
                    change: "8 clientes",
                    positive: false,
                    icon: "⚠️",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-4 rounded-2xl bg-white"
                    style={{
                      border: "1px solid rgba(11,23,54,0.07)",
                      boxShadow: "0 2px 12px rgba(11,23,54,0.05)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {stat.label}
                      </span>
                      <span className="text-base">{stat.icon}</span>
                    </div>
                    <div
                      className="text-xl font-bold text-[#0B1736] mb-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs font-medium"
                      style={{
                        color: stat.positive ? "#10D876" : "#EF4444",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + List */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Chart */}
                <div
                  className="lg:col-span-3 p-4 rounded-2xl bg-white"
                  style={{
                    border: "1px solid rgba(11,23,54,0.07)",
                    boxShadow: "0 2px 12px rgba(11,23,54,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4
                        className="text-sm font-bold text-[#0B1736]"
                        style={{ fontFamily: "'Sora', sans-serif" }}
                      >
                        Recebimentos
                      </h4>
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Últimos 7 dias
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#10D876] font-semibold">
                      <TrendingUp size={14} />
                      +18% esta semana
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={CHART_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10D876" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10D876" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(11,23,54,0.05)" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "'Inter', sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#9ca3af", fontFamily: "'Inter', sans-serif" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `R$${v}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="valor"
                        stroke="#10D876"
                        strokeWidth={2.5}
                        fill="url(#colorValor)"
                        dot={{ fill: "#10D876", r: 3, strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#10D876" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Payment list */}
                <div
                  className="lg:col-span-2 p-4 rounded-2xl bg-white"
                  style={{
                    border: "1px solid rgba(11,23,54,0.07)",
                    boxShadow: "0 2px 12px rgba(11,23,54,0.05)",
                  }}
                >
                  <h4
                    className="text-sm font-bold text-[#0B1736] mb-4"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Cobranças recentes
                  </h4>
                  <div className="space-y-3">
                    {PAYMENTS.map((payment) => {
                      const config = STATUS_CONFIG[payment.status as keyof typeof STATUS_CONFIG];
                      const StatusIcon = config.icon;
                      return (
                        <div key={payment.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: config.bg }}
                            >
                              <StatusIcon size={13} color={config.color} />
                            </div>
                            <div className="min-w-0">
                              <div
                                className="text-xs font-semibold text-[#0B1736] truncate"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                              >
                                {payment.name}
                              </div>
                              <div className="text-xs text-gray-400">{payment.date}</div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div
                              className="text-xs font-bold"
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                color: "#0B1736",
                              }}
                            >
                              {payment.value}
                            </div>
                            <div
                              className="text-xs font-medium"
                              style={{ color: config.color }}
                            >
                              {config.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
