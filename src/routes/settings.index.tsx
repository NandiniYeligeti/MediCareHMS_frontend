import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Stethoscope, Users, Hospital, ShieldCheck, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/settings/")({
  component: SettingsPage,
});

const opts = [
  { icon: Stethoscope, title: "Doctor Setup", desc: "Manage practitioners & fees" },
  { icon: Users, title: "Staff Setup", desc: "Reception, nurses, ward boys" },
  { icon: Hospital, title: "Ward Setup", desc: "Beds, types, daily charges" },
  { icon: ShieldCheck, title: "User Roles", desc: "Permissions & access" },
  { icon: Building2, title: "Hospital Details", desc: "Branding, contact & logos" },
];

function SettingsPage() {
  const { session } = useAuth();
  const role = (session?.role === "management" ? "management" : "reception") as "management" | "reception";
  return (
    <PortalShell role={role} title="Settings">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {opts.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-5 shadow-card hover:shadow-elegant transition cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary text-primary-foreground grid place-items-center mb-3">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
