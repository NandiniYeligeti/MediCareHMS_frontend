import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { StatCard } from "@/components/StatCard";
import { Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/doctor/")({
  component: DoctorHome,
});

function DoctorHome() {
  const { session } = useAuth();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
  return (
    <MobileShell title="Doctor Dashboard">
      <div className="space-y-6 max-w-4xl mx-auto pb-10">
        <div className="mb-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{today}</p>
          <h2 className="text-2xl font-extrabold text-foreground mt-1">Hello, {session?.username || "Doctor"} 👋</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Patients" value={9} icon={<Users />} accent="primary" />
          <StatCard label="Waiting" value={3} icon={<Clock />} accent="warning" />
          <StatCard label="Done" value={6} icon={<CheckCircle2 />} accent="success" />
        </div>

        <Card className="relative overflow-hidden p-6 border-0 shadow-elegant" style={{ background: "linear-gradient(135deg, #1e5bbf, #1a6fd4)", color: "white" }}>
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-wider text-blue-200 uppercase mb-1">Up next</p>
            <p className="text-3xl font-extrabold mb-1">Sneha Iyer</p>
            <p className="text-sm text-blue-100 font-medium mb-5">Token #12 • 10:30 AM</p>
            <Button asChild className="bg-background text-blue-700 hover:bg-muted/50 font-bold border-0 shadow-sm">
              <Link to="/doctor/patients">View Patients <ArrowRight className="h-4 w-4 ml-1.5" /></Link>
            </Button>
          </div>
          <div className="absolute right-[-20px] top-[-20px] opacity-10">
            <Clock size={160} />
          </div>
        </Card>

        <Card className="p-5 shadow-card border-border bg-amber-50/50">
          <h3 className="font-bold text-amber-900 flex items-center gap-2 text-sm">💡 Quick Tip</h3>
          <p className="text-sm text-amber-800/80 mt-1.5 font-medium leading-relaxed">Tap "DONE" after each consultation — reception will be automatically notified to call the next patient.</p>
        </Card>
      </div>
    </MobileShell>
  );
}
