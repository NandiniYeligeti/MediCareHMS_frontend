import { ReactNode, useEffect } from "react";
import { useAuth, roleHome } from "@/lib/auth";
import { useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, History, User, LogOut, Hospital, CalendarDays } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { PortalShell } from "./PortalShell";

const tabs = [
  { url: "/doctor", label: "Home", icon: LayoutDashboard },
  { url: "/doctor/patients", label: "Patients", icon: Users },
  { url: "/doctor/schedule", label: "Schedule", icon: CalendarDays },
  { url: "/doctor/history", label: "History", icon: History },
  { url: "/doctor/profile", label: "Profile", icon: User },
];

export function MobileShell({ title, children }: { title: string; children: ReactNode }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!session) navigate({ to: "/" });
    else if (session.role !== "doctor") navigate({ to: roleHome[session.role] });
  }, [session, navigate]);

  if (!session) return null;

  // Desktop view — render the same sidebar shell used by other portals
  if (!isMobile) {
    return (
      <PortalShell role="doctor" title={title}>
        {children}
      </PortalShell>
    );
  }

  // Mobile view — phone-style layout with bottom nav
  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-background flex flex-col shadow-elegant">
        <header className="bg-gradient-hero text-primary-foreground p-4 pb-6 rounded-b-3xl shadow-elegant">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-white/15 grid place-items-center">
                <Hospital className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs opacity-80">MediCare</p>
                <p className="font-semibold text-sm">{title}</p>
              </div>
            </div>
            <button onClick={() => { logout(); navigate({ to: "/" }); }} className="h-9 w-9 rounded-full bg-white/15 grid place-items-center">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24 overflow-auto">{children}</main>

        <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-card border-t shadow-elegant rounded-t-2xl">
          <div className="grid grid-cols-5">
            {tabs.map((t) => {
              const active = t.url === path || (t.url !== "/doctor" && path.startsWith(t.url));
              const isHome = t.url === "/doctor" && path === "/doctor";
              const isActive = isHome || active;
              return (
                <Link key={t.url} to={t.url} className={`flex flex-col items-center gap-1 py-3 text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  <t.icon className="h-5 w-5" />
                  <span className="font-medium">{t.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
