import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/doctor/")({
  component: DoctorHome,
});

function DoctorHome() {
  const { session } = useAuth();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  return (
    <MobileShell title="Doctor Dashboard">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">{today}</p>
          <h2 className="text-xl font-bold">Hello, {session?.username || "Doctor"} 👋</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MetricCard icon={Users} label="Total" value={9} accent="bg-primary/10 text-primary" />
          <MetricCard icon={Clock} label="Waiting" value={3} accent="bg-warning/15 text-warning-foreground" />
          <MetricCard icon={CheckCircle2} label="Done" value={6} accent="bg-success/15 text-success" />
        </div>

        <Card className="p-4 bg-gradient-hero text-primary-foreground shadow-elegant">
          <p className="text-xs opacity-80">Up next</p>
          <p className="text-lg font-bold mt-1">Sneha Iyer</p>
          <p className="text-sm opacity-90">Token #12 • 10:30 AM</p>
          <Button asChild variant="secondary" className="mt-3 bg-white text-primary hover:bg-white/90">
            <Link to="/doctor/patients">View Patients <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-sm">Tip</h3>
          <p className="text-xs text-muted-foreground mt-1">Tap "DONE" after each consultation — reception will be notified to call the next patient.</p>
        </Card>
      </div>
    </MobileShell>
  );
}

function MetricCard({ icon: Icon, label, value, accent }: any) {
  return (
    <Card className="p-3 text-center">
      <div className={`mx-auto h-9 w-9 rounded-full grid place-items-center ${accent}`}><Icon className="h-4 w-4" /></div>
      <p className="text-xl font-bold mt-2">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </Card>
  );
}
