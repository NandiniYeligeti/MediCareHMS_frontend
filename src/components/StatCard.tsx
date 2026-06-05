import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const accentConfig = {
  primary:     { bg: "linear-gradient(135deg,#1557b0,#1a6fd4)", light: "#e8f0fe", text: "#1557b0" },
  success:     { bg: "linear-gradient(135deg,#16a34a,#22c55e)", light: "#dcfce7", text: "#16a34a" },
  warning:     { bg: "linear-gradient(135deg,#d97706,#f59e0b)", light: "#fef3c7", text: "#d97706" },
  info:        { bg: "linear-gradient(135deg,#0284c7,#38bdf8)", light: "#e0f2fe", text: "#0284c7" },
  destructive: { bg: "linear-gradient(135deg,#dc2626,#ef4444)", light: "#fee2e2", text: "#dc2626" },
} as const;

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  accent = "primary",
  subtitle,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: keyof typeof accentConfig;
  subtitle?: string;
}) {
  const cfg = accentConfig[accent];
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div>
          <p className="stat-card-label">{label}</p>
          <p className="stat-card-value">{value}</p>
          {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        </div>
        {icon && (
          <div className="stat-card-icon" style={{ background: cfg.bg }}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="stat-card-trend" style={{ color: trendUp === false ? "#dc2626" : "#16a34a" }}>
          {trendUp === false ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          <span>{trend}</span>
        </div>
      )}
      {/* colored bottom accent bar */}
      <div className="stat-card-bar" style={{ background: cfg.bg }} />
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  let style: React.CSSProperties = { background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" };
  if (s.includes("wait"))                                  style = { background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" };
  else if (s.includes("consult") || s === "in consultation") style = { background: "#e0f2fe", color: "#075985", border: "1px solid #7dd3fc" };
  else if (s.includes("done") || s === "active" || s === "available") style = { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
  else if (s.includes("miss") || s.includes("occupied"))   style = { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" };
  else if (s.includes("reserved") || s.includes("leave"))  style = { background: "#ffedd5", color: "#9a3412", border: "1px solid #fdba74" };
  return (
    <span style={{ ...style, display: "inline-flex", alignItems: "center", borderRadius: "999px", padding: "2px 10px", fontSize: "0.7rem", fontWeight: 600 }}>
      {status}
    </span>
  );
}
