import { ReactNode, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth, Role, roleHome } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

export function PortalShell({ role, title, children }: { role: Role; title: string; children: ReactNode }) {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate({ to: "/" });
    } else if (session.role !== role) {
      navigate({ to: roleHome[session.role] });
    }
  }, [session, role, navigate]);

  if (!session) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b bg-card px-4 sticky top-0 z-10 shadow-soft">
            <SidebarTrigger />
            <h1 className="text-base font-semibold">{title}</h1>
            <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hidden sm:inline">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}</span>
              <div className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                {session.username.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
