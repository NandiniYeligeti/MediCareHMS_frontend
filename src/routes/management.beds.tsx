import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { beds, BedStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/management/beds")({
  component: BedsPage,
});

const statusClass: Record<BedStatus, string> = {
  available: "bg-success/15 text-success border-success/40",
  occupied: "bg-destructive/15 text-destructive border-destructive/40",
  reserved: "bg-orange-500/15 text-orange-600 border-orange-500/40",
};

function BedsPage() {
  const wardsList = Array.from(new Set(beds.map((b) => b.ward)));
  return (
    <PortalShell role="management" title="Beds">
      <div className="space-y-6">
        <Card className="p-4 shadow-card flex flex-wrap gap-4 text-sm">
          <Legend color="bg-success" label="Available" />
          <Legend color="bg-destructive" label="Occupied" />
          <Legend color="bg-orange-500" label="Reserved" />
        </Card>

        {wardsList.map((ward) => (
          <Card key={ward} className="p-5 shadow-card">
            <h3 className="font-semibold mb-3">{ward} Ward</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {beds.filter((b) => b.ward === ward).map((b) => (
                <div
                  key={b.id}
                  className={`aspect-square rounded-md border-2 flex flex-col items-center justify-center text-xs font-medium ${statusClass[b.status]}`}
                  title={`${b.id} — ${b.status}`}
                >
                  <span className="font-bold">{b.id}</span>
                  <span className="text-[10px] capitalize opacity-80">{b.status}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}
