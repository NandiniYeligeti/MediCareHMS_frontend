import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, Role, roleHome } from "@/lib/auth";
import { Hospital, Activity, ShieldCheck, Stethoscope } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Login,
});

function Login() {
  const { login, session } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("management");

  if (session) {
    navigate({ to: roleHome[session.role] });
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }
    login({ username, role });
    toast.success(`Welcome, ${username}`);
    navigate({ to: roleHome[role] });
  };

  const quickFill = (r: Role, u: string) => {
    setRole(r);
    setUsername(u);
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Hero */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-hero text-primary-foreground p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Hospital className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">MediCare HMS</span>
        </div>

        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Run your hospital with calm precision.
          </h1>
          <p className="text-primary-foreground/85 text-lg">
            Manage OPD queues, admissions, wards, discharge summaries and billing — all from one fast, role-based system.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: Stethoscope, label: "OPD" },
              { icon: Activity, label: "IPD" },
              { icon: ShieldCheck, label: "Secure" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-lg bg-white/10 backdrop-blur p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-primary-foreground/70">© 2026 MediCare HMS</p>

        {/* decorative orbs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 shadow-elegant">
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground">
              <Hospital className="h-5 w-5" />
            </div>
            <span className="font-bold">MediCare HMS</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to access your portal.</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username / Mobile</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" autoComplete="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-95 shadow-elegant">
              Login
            </Button>
            <button type="button" className="w-full text-sm text-muted-foreground hover:text-foreground">
              Forgot password?
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Demo accounts</p>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => quickFill("management", "admin")}>Management</Button>
              <Button variant="outline" size="sm" onClick={() => quickFill("reception", "reception")}>Reception</Button>
              <Button variant="outline" size="sm" onClick={() => quickFill("doctor", "dr.amit")}>Doctor</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
