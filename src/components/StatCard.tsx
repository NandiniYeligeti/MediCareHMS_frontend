import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  trend,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  accent?: "primary" | "success" | "warning" | "info" | "destructive";
}) {
  const accentMap = {
    primary: "from-primary to-primary-glow text-primary-foreground",
    success: "from-success to-success text-success-foreground",
    warning: "from-warning to-warning text-warning-foreground",
    info: "from-info to-info text-info-foreground",
    destructive: "from-destructive to-destructive text-destructive-foreground",
  } as const;
  return (
    <Card className="p-4 shadow-card hover:shadow-elegant transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${accentMap[accent]} shadow-soft`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  let cls = "bg-muted text-muted-foreground";
  if (s.includes("wait")) cls = "bg-warning/15 text-warning-foreground border border-warning/40";
  else if (s.includes("consult") || s === "in consultation") cls = "bg-info/15 text-info border border-info/40";
  else if (s.includes("done") || s === "active" || s === "available") cls = "bg-success/15 text-success border border-success/40";
  else if (s.includes("miss") || s.includes("occupied")) cls = "bg-destructive/15 text-destructive border border-destructive/40";
  else if (s.includes("reserved") || s.includes("leave")) cls = "bg-orange-500/15 text-orange-600 border border-orange-500/40";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>{status}</span>;
}
