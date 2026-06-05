import { Link, useRouterState } from "@tanstack/react-router";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { useAuth, Role } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  BedDouble,
  Hospital,
  FileText,
  Settings,
  UserPlus,
  CalendarClock,
  CalendarDays,
  ListOrdered,
  LogIn,
  Receipt,
  LogOut,
  Activity,
  Baby,
  FlaskConical,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Item = { title: string; url: string; icon: React.ElementType; badge?: number };

const menus: Record<Role, { label: string; items: Item[] }[]> = {
  management: [
    {
      label: "Overview",
      items: [{ title: "Dashboard", url: "/management", icon: LayoutDashboard }],
    },
    {
      label: "Operations",
      items: [
        { title: "Doctors", url: "/management/doctors", icon: Stethoscope },
        { title: "Staff", url: "/management/staff", icon: Users },
        { title: "Wards", url: "/management/wards", icon: Hospital },
        { title: "Beds", url: "/management/beds", icon: BedDouble },
      ],
    },
    {
      label: "Insights",
      items: [
        { title: "Reports", url: "/reports", icon: FileText },
        { title: "Settings", url: "/settings", icon: Settings },
        
      ],
    },
  ],
  reception: [
    {
      label: "Overview",
      items: [{ title: "Dashboard", url: "/reception", icon: LayoutDashboard }],
    },
    {
      label: "Patient Flow",
      items: [
        { title: "Patients", url: "/reception/patients", icon: UserPlus },
        { title: "OPD Booking", url: "/reception/opd", icon: CalendarClock },
        { title: "Queue", url: "/reception/queue", icon: ListOrdered },
      ],
    },
    {
      label: "IPD",
      items: [
        { title: "Admission", url: "/reception/admission", icon: LogIn },
        { title: "Ward View", url: "/reception/wards", icon: Hospital },
        { title: "Discharge", url: "/reception/discharge", icon: Activity },
        { title: "Birth Certificate", url: "/reception/birth", icon: Baby },
      ],
    },
    {
      label: "Finance",
      items: [
        { title: "Billing", url: "/reception/billing", icon: Receipt },
        { title: "Advance Payments", url: "/reception/advances", icon: Receipt },
        { title: "Reports", url: "/reports", icon: FileText },
      ],
    },
    {
      label: "Directory",
      items: [
        { title: "Staff", url: "/reception/staff", icon: Users },
        { title: "Settings", url: "/settings", icon: Settings },
     
      ],
    },
  ],
  doctor: [
    {
      label: "Overview",
      items: [{ title: "Dashboard", url: "/doctor", icon: LayoutDashboard }],
    },
    {
      label: "Consultations",
      items: [
        { title: "Patients", url: "/doctor/patients", icon: Users },
        { title: "Under Investigation", url: "/doctor/investigations", icon: FlaskConical },
        { title: "Schedule", url: "/doctor/schedule", icon: CalendarDays },
        { title: "History", url: "/doctor/history", icon: FileText },
      ],
    },
    {
      label: "Account",
      items: [
        { title: "Settings", url: "/settings", icon: Settings },
      
      ],
    },
  ],
};

export function AppSidebar({ role }: { role: Role }) {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  const groups = menus[role] || [];

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("hms-theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("hms-theme", theme);
  }, [theme]);

  const isActive = (url: string) => {
    if (url === "/management" || url === "/reception" || url === "/doctor") {
      return path === url;
    }
    return (
      url === path ||
      (url !== "/" &&
        path.startsWith(url) &&
        (path[url.length] === "/" || path.length === url.length))
    );
  };

  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      sessionStorage.setItem("sidebar-scroll", target.scrollTop.toString());
    };
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener("scroll", handleScroll);
      const saved = sessionStorage.getItem("sidebar-scroll");
      if (saved) nav.scrollTop = parseInt(saved, 10);
    }
    return () => nav?.removeEventListener("scroll", handleScroll);
  }, []);

  const allItems = groups.flatMap((g) => g.items);
  const initials = session?.username?.slice(0, 2).toUpperCase() ?? "HC";
  const displayName = session?.username ?? "User";
  const displayEmail = `${displayName.toLowerCase()}@medicare.in`;

  return (
    <Sidebar collapsible="icon" className="app-sidebar-root border-r-0">
      {/* Gradient wrapper that fills the entire sidebar */}
      <div
        className="app-sidebar-gradient flex flex-col h-full overflow-hidden"
        style={{
          background: "linear-gradient(175deg, #1a3d78 0%, #1557b0 45%, #1a6fd4 100%)",
          position: "relative",
        }}
      >
        {/* ── Collapse / Expand toggle button ─────────────────── */}
        <button
          onClick={toggleSidebar}
          className="app-sidebar-toggle-btn"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        {/* ── Profile ─────────────────────────────────────────── */}
        <div
          className={`app-sidebar-profile ${collapsed ? "app-sidebar-profile--collapsed" : ""}`}
        >
          {/* Avatar */}
          <div className="app-sidebar-avatar">
            <span className="app-sidebar-avatar-initials">{initials}</span>
            <span className="app-sidebar-avatar-ring" />
          </div>

          {!collapsed && (
            <div className="app-sidebar-user">
              <p className="app-sidebar-name">{displayName}</p>
              <p className="app-sidebar-email">{displayEmail}</p>
              <ChevronDown
                size={14}
                className="app-sidebar-chevron"
                style={{ color: "rgba(255,255,255,0.5)", marginTop: "4px" }}
              />
            </div>
          )}
        </div>

        {/* ── Navigation ──────────────────────────────────────── */}
        <nav ref={navRef} className="app-sidebar-nav flex-1 overflow-y-auto">
          {allItems.map((item) => {
            const active = isActive(item.url);
            const Icon = item.icon;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`app-sidebar-item ${active ? "app-sidebar-item--active" : ""} ${collapsed ? "app-sidebar-item--collapsed" : ""}`}
              >
                <span className="app-sidebar-item-icon">
                  <Icon size={18} />
                </span>
                {!collapsed && (
                  <>
                    <span className="app-sidebar-item-label">{item.title}</span>
                    {item.badge != null && (
                      <span className="app-sidebar-badge">{item.badge}</span>
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            className={`app-sidebar-item app-sidebar-item--logout w-full ${collapsed ? "app-sidebar-item--collapsed" : ""}`}
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
          >
            <span className="app-sidebar-item-icon">
              <LogOut size={18} />
            </span>
            {!collapsed && <span className="app-sidebar-item-label">Logout</span>}
          </button>
        </nav>

        {/* ── Light / Dark Toggle ──────────────────────────────── */}
        {!collapsed && (
          <div className="app-sidebar-theme-row">
            <div className="app-sidebar-theme-toggle">
              <button
                className={`app-sidebar-theme-btn ${theme === "light" ? "app-sidebar-theme-btn--active" : ""}`}
                onClick={() => setTheme("light")}
              >
                <Sun size={13} />
                <span>Light</span>
              </button>
              <button
                className={`app-sidebar-theme-btn ${theme === "dark" ? "app-sidebar-theme-btn--active" : ""}`}
                onClick={() => setTheme("dark")}
              >
                <Moon size={13} />
                <span>Dark</span>
              </button>
            </div>
          </div>
        )}

        {/* Collapsed: just a tiny theme icon */}
        {collapsed && (
          <div className="app-sidebar-theme-row app-sidebar-theme-row--collapsed">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="app-sidebar-theme-icon-btn"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
