import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth, Role } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";

type Item = { title: string; url: string; icon: any };

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
        { title: "Profile", url: "/doctor/profile", icon: UserPlus },
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    },
  ],
};

export function AppSidebar({ role }: { role: Role }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  const groups = menus[role] || [];

  const isActive = (url: string) =>
    url === path || (url !== "/" && path.startsWith(url) && (path[url.length] === "/" || path.length === url.length));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground shadow-elegant">
            <Hospital className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">MediCare HMS</span>
              <span className="text-[11px] capitalize text-sidebar-foreground/60">{role} portal</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && session && (
          <div className="px-2 py-1 text-xs text-sidebar-foreground/70">
            Signed in as <span className="font-medium text-sidebar-foreground">{session.username}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
