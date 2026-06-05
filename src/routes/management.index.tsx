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
      <div className="space-y-8 max-w-7xl mx-auto pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard label="OPD Today" value={summary.opdToday} icon={<Users />} accent="primary" trend="+12%" trendUp={true} />
          <StatCard label="Admissions" value={summary.admissionsToday} icon={<Activity />} accent="info" trend="+2" trendUp={true} />
          <StatCard label="Available Beds" value={summary.availableBeds} icon={<BedDouble />} accent="warning" trend="-4" trendUp={false} />
          <StatCard label="Discharges" value={summary.dischargesToday} icon={<Discharge />} accent="success" trend="+5" trendUp={true} />
          <StatCard label="Revenue" value={currency(summary.revenueToday)} icon={<IndianRupee />} accent="success" trend="+8.5%" trendUp={true} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="p-6 lg:col-span-2 shadow-card border-border">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Ward Occupancy</h2>
              <p className="text-sm text-muted-foreground">Live bed utilization across wards</p>
            </div>
            <div className="space-y-5">
              {wardOccupancy.map((w) => {
                const pct = Math.round((w.used / w.total) * 100);
                return (
                  <div key={w.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-foreground">{w.name}</span>
                      <span className="text-muted-foreground font-medium">{w.used} / {w.total}</span>
                    </div>
                    <Progress value={pct} className="h-2.5 bg-muted" />
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 shadow-card border-border">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-foreground">Doctor Activity</h2>
              <p className="text-sm text-muted-foreground">Patients seen today</p>
            </div>
            <ul className="space-y-4">
              {doctorActivity.map((d) => (
                <li key={d.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                  <div>
                    <p className="text-sm font-bold text-foreground">{d.name}</p>
                    <p className="text-xs font-medium text-muted-foreground">{d.specialization}</p>
                  </div>
                  <div className="bg-background px-3 py-1 rounded-lg border border-border shadow-sm">
                    <span className="text-base font-extrabold text-blue-600">{d.seen}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="p-6 shadow-card border-border">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">Recent Activities</h2>
          </div>
          <ul className="space-y-1">
            <li className="flex justify-between items-center py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium text-foreground">New admission — <span className="font-bold">Asha Pillai</span> (Maternity, Bed M-401)</span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">10 min ago</span>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium text-foreground">Discharge generated — <span className="font-bold">Mohit Jain</span> (<span className="text-green-600">₹17,500</span>)</span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">28 min ago</span>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium text-foreground">Dr. Amit Sharma marked Token #12 as <span className="text-green-600 font-bold">DONE</span></span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">42 min ago</span>
            </li>
            <li className="flex justify-between items-center py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium text-foreground">OPD booking — <span className="font-bold">Sneha Iyer</span> (Token #12)</span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">1 hr ago</span>
            </li>
          </ul>
        </Card>
      </div>
    </PortalShell>
  );
}
