import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Stethoscope, Phone, Mail, Calendar } from "lucide-react";

export const Route = createFileRoute("/doctor/profile")({
  component: DoctorProfile,
});

function DoctorProfile() {
  const { session } = useAuth();
  return (
    <MobileShell title="Profile">
      <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary-glow/5">
        <div className="h-20 w-20 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-2xl font-bold mx-auto">
          {session?.username.slice(0, 2).toUpperCase() || "DR"}
        </div>
        <h2 className="text-lg font-bold mt-3">Dr. Amit Sharma</h2>
        <p className="text-sm text-muted-foreground">General Physician</p>
      </Card>

      <div className="space-y-2 mt-4">
        <Row icon={Stethoscope} label="Qualification" v="MBBS, MD (Internal Medicine)" />
        <Row icon={Phone} label="Mobile" v="+91 98765 43210" />
        <Row icon={Mail} label="Email" v="amit.sharma@medicare.com" />
        <Row icon={Calendar} label="Available" v="Mon–Sat • 10:00 AM – 2:00 PM" />
      </div>
    </MobileShell>
  );
}

function Row({ icon: Icon, label, v }: any) {
  return (
    <Card className="p-3 flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="h-4 w-4" /></div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{v}</p>
      </div>
    </Card>
  );
}
