import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/patient")({
  component: DoctorPatientDetail,
});

function DoctorPatientDetail() {
  const navigate = useNavigate();
  return (
    <MobileShell title="Patient Details">
      <div className="space-y-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary-glow/5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center font-bold">SI</div>
            <div>
              <p className="font-bold">Sneha Iyer</p>
              <p className="text-xs text-muted-foreground">Female, 28 • Token #12</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="space-y-1.5"><Label>Symptoms</Label><Textarea rows={2} placeholder="Patient complaints..." /></div>
          <div className="space-y-1.5"><Label>Diagnosis</Label><Textarea rows={2} placeholder="Clinical diagnosis..." /></div>
          <div className="space-y-1.5"><Label>Prescription</Label><Textarea rows={3} placeholder="Medications, dosage..." /></div>
          <div className="space-y-1.5"><Label>Notes</Label><Textarea rows={2} placeholder="Follow-up advice..." /></div>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => toast.success("Notes saved")}><Save className="h-4 w-4 mr-1" />Save</Button>
          <Button className="flex-1 bg-gradient-primary" onClick={() => { toast.success("Marked DONE. Next patient called."); navigate({ to: "/doctor/patients" }); }}>
            <Check className="h-4 w-4 mr-1" />Done
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
