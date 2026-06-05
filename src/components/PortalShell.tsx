import { ReactNode, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
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
      <div className="flex min-h-screen w-full bg-[#eef2fb] dark:bg-[#0f172a] transition-colors duration-300">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top header bar */}
          <header
            className="h-14 flex items-center gap-3 px-5 sticky top-0 z-10 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-white/5 transition-colors duration-300 shadow-sm"
          >
            <h1 className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">{title}</h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ background: "linear-gradient(135deg, #4a9eff, #1557b0)" }}
              >
                {session.username.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-5 md:p-7 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
