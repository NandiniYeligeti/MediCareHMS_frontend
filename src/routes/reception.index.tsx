import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { summary, queue, patients, doctorActivity } from "@/lib/mock-data";
import { StatusPill } from "@/components/StatCard";
import { Users, Clock, Activity, BedDouble } from "lucide-react";

export const Route = createFileRoute("/reception/")({
  component: ReceptionDashboard,
});

function ReceptionDashboard() {
  return (
    <PortalShell role="reception" title="Reception Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard label="Today's Patients" value={summary.opdToday} icon={<Users />} trend="+15%" trendUp={true} />
          <StatCard label="Waiting" value={queue.filter((q) => q.status === "Waiting").length} icon={<Clock />} accent="warning" trend="+2" trendUp={false} />
          <StatCard label="Admissions" value={summary.admissionsToday} icon={<Activity />} accent="info" trend="-1" trendUp={false} />
          <StatCard label="Available Beds" value={summary.availableBeds} icon={<BedDouble />} accent="success" trend="+2" trendUp={true} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-card border-border">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground">Doctor Queue Summary</h2>
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-muted-foreground">Doctor</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Waiting</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Done</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctorActivity.map((d) => (
                    <TableRow key={d.name} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">{d.name}</TableCell>
                      <TableCell className="text-right text-orange-600 font-semibold">{Math.max(0, 5 - Math.floor(d.seen / 5))}</TableCell>
                      <TableCell className="text-right text-green-600 font-semibold">{d.seen}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6 shadow-card border-border">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground">Recent Patients</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {patients.map((p) => (
                <li key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">{p.name}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-0.5">{p.id} • {p.gender}, {p.age}</p>
                  </div>
                  <StatusPill status="Active" />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
