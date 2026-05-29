import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { summary, wardOccupancy, doctorActivity, currency } from "@/lib/mock-data";
import { Users, BedDouble, Activity, LogOut as Discharge, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/management/")({
  component: ManagementDashboard,
});

function ManagementDashboard() {
  return (
    <PortalShell role="management" title="Management Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="OPD Today" value={summary.opdToday} icon={<Users className="h-5 w-5" />} accent="primary" />
          <StatCard label="Admissions" value={summary.admissionsToday} icon={<Activity className="h-5 w-5" />} accent="info" />
          <StatCard label="Available Beds" value={summary.availableBeds} icon={<BedDouble className="h-5 w-5" />} accent="success" />
          <StatCard label="Discharges" value={summary.dischargesToday} icon={<Discharge className="h-5 w-5" />} accent="warning" />
          <StatCard label="Revenue" value={currency(summary.revenueToday)} icon={<IndianRupee className="h-5 w-5" />} accent="success" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-5 lg:col-span-2 shadow-card">
            <h2 className="text-base font-semibold">Ward Occupancy</h2>
            <p className="text-xs text-muted-foreground">Live bed utilization across wards</p>
            <div className="mt-4 space-y-4">
              {wardOccupancy.map((w) => {
                const pct = Math.round((w.used / w.total) * 100);
                return (
                  <div key={w.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{w.name}</span>
                      <span className="text-muted-foreground">{w.used} / {w.total}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 shadow-card">
            <h2 className="text-base font-semibold">Doctor Activity</h2>
            <p className="text-xs text-muted-foreground">Patients seen today</p>
            <ul className="mt-4 space-y-3">
              {doctorActivity.map((d) => (
                <li key={d.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.specialization}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">{d.seen}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-5 shadow-card">
          <h2 className="text-base font-semibold">Recent Activities</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex justify-between border-b pb-2"><span>New admission — Asha Pillai (Maternity, Bed M-401)</span><span className="text-muted-foreground">10 min ago</span></li>
            <li className="flex justify-between border-b pb-2"><span>Discharge generated — Mohit Jain (₹17,500)</span><span className="text-muted-foreground">28 min ago</span></li>
            <li className="flex justify-between border-b pb-2"><span>Dr. Amit Sharma marked Token #12 as DONE</span><span className="text-muted-foreground">42 min ago</span></li>
            <li className="flex justify-between"><span>OPD booking — Sneha Iyer (Token #12)</span><span className="text-muted-foreground">1 hr ago</span></li>
          </ul>
        </Card>
      </div>
    </PortalShell>
  );
}
