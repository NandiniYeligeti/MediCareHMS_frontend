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
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Today's Patients" value={summary.opdToday} icon={<Users className="h-5 w-5" />} />
          <StatCard label="Waiting" value={queue.filter((q) => q.status === "Waiting").length} icon={<Clock className="h-5 w-5" />} accent="warning" />
          <StatCard label="Admissions" value={summary.admissionsToday} icon={<Activity className="h-5 w-5" />} accent="info" />
          <StatCard label="Available Beds" value={summary.availableBeds} icon={<BedDouble className="h-5 w-5" />} accent="success" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-5 shadow-card">
            <h2 className="font-semibold">Doctor Queue Summary</h2>
            <Table className="mt-3">
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead className="text-right">Waiting</TableHead>
                  <TableHead className="text-right">Done</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctorActivity.map((d) => (
                  <TableRow key={d.name}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-right">{Math.max(0, 5 - Math.floor(d.seen / 5))}</TableCell>
                    <TableCell className="text-right">{d.seen}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-5 shadow-card">
            <h2 className="font-semibold">Recent Patients</h2>
            <ul className="mt-3 divide-y">
              {patients.map((p) => (
                <li key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.id} • {p.gender}, {p.age}</p>
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
