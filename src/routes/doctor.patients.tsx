import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { queue, QueueStatus } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Eye } from "lucide-react";

export const Route = createFileRoute("/doctor/patients")({
  component: DoctorPatients,
});

const colorMap: Record<QueueStatus, string> = {
  Waiting: "border-l-warning bg-warning/5",
  "In Consultation": "border-l-info bg-info/5",
  Done: "border-l-success bg-success/5",
  Missed: "border-l-destructive bg-destructive/5",
  Scheduled: "border-l-primary bg-primary/5",
  Cancelled: "border-l-muted bg-muted/20",
};

function DoctorPatients() {
  const [list, setList] = useState(queue);

  const markDone = (token: number) => {
    setList((l) => l.map((q) => q.token === token ? { ...q, status: "Done" as QueueStatus } : q));
    toast.success(`Token #${token} marked DONE. Reception notified.`);
  };

  return (
    <MobileShell title="Today's Patients">
      <div className="space-y-3">
        {list.map((q) => (
          <Card key={q.token} className={`p-4 border-l-4 ${colorMap[q.status]} shadow-soft`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">Token</p>
                <p className="text-2xl font-bold">#{q.token}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-card border font-medium">{q.status}</span>
            </div>
            <div className="mt-2">
              <p className="font-semibold">{q.patient}</p>
              <p className="text-xs text-muted-foreground">Arrived {q.time}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link to="/doctor/patient">
                  <Eye className="h-4 w-4 mr-1" /> Open
                </Link>
              </Button>
              <Button size="sm" disabled={q.status === "Done"} onClick={() => markDone(q.token)} className="flex-1 bg-gradient-primary">
                <Check className="h-4 w-4 mr-1" /> Done
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </MobileShell>
  );
}
