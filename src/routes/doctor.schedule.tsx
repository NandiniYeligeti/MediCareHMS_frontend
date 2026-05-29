import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorSchedule, todayISO, DoctorAppointment } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { CalendarDays, Clock, Phone, User, Stethoscope, AlertCircle, CheckCircle2, XCircle, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/doctor/schedule")({
  component: DoctorSchedule,
});

function DoctorSchedule() {
  const [tab, setTab] = useState<"upcoming" | "today" | "past">("upcoming");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const now = todayISO;
    let list = doctorSchedule.slice();
    if (tab === "upcoming") list = list.filter(a => a.date > now);
    else if (tab === "today") list = list.filter(a => a.date === now);
    else list = list.filter(a => a.date < now);

    if (from) list = list.filter(a => a.date >= from);
    if (to) list = list.filter(a => a.date <= to);
    if (typeFilter !== "all") list = list.filter(a => a.type === typeFilter);

    return list.sort((a, b) =>
      tab === "past"
        ? (a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date))
        : (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date))
    );
  }, [tab, from, to, typeFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, DoctorAppointment[]>();
    filtered.forEach(a => {
      const arr = map.get(a.date) || [];
      arr.push(a);
      map.set(a.date, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const upcomingCount = doctorSchedule.filter(a => a.date > todayISO).length;
  const todayCount = doctorSchedule.filter(a => a.date === todayISO).length;
  const pastCount = doctorSchedule.filter(a => a.date < todayISO).length;

  return (
    <MobileShell title="My Schedule">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="Upcoming" value={upcomingCount} icon={CalendarCheck} tone="primary" />
          <MiniStat label="Today" value={todayCount} icon={Clock} tone="accent" />
          <MiniStat label="Past" value={pastCount} icon={CalendarDays} tone="muted" />
        </div>

        <Card className="p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">From date</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To date</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="OPD">OPD</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Tele">Teleconsult</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={() => { setFrom(""); setTo(""); setTypeFilter("all"); }}>
                Clear filters
              </Button>
            </div>
          </div>
        </Card>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-3">
            {grouped.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No appointments in this range
              </Card>
            ) : (
              <div className="space-y-4">
                {grouped.map(([date, items]) => (
                  <div key={date}>
                    <DateHeader date={date} count={items.length} />
                    <div className="space-y-2 mt-2">
                      {items.map(a => <AppointmentCard key={a.id} appt={a} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileShell>
  );
}

function DateHeader({ date, count }: { date: string; count: number }) {
  const d = new Date(date);
  const label = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
  const isToday = date === todayISO;
  return (
    <div className="flex items-center justify-between border-b pb-1.5">
      <p className="text-sm font-semibold flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-primary" />
        {label}
        {isToday && <Badge className="bg-primary text-primary-foreground">Today</Badge>}
      </p>
      <span className="text-xs text-muted-foreground">{count} appt{count > 1 ? "s" : ""}</span>
    </div>
  );
}

const statusStyle: Record<DoctorAppointment["status"], { cls: string; icon: any }> = {
  Scheduled: { cls: "border-l-muted-foreground/40 bg-muted/30", icon: Clock },
  Confirmed: { cls: "border-l-info bg-info/5", icon: CheckCircle2 },
  Done: { cls: "border-l-success bg-success/5", icon: CheckCircle2 },
  Missed: { cls: "border-l-destructive bg-destructive/5", icon: XCircle },
  Cancelled: { cls: "border-l-destructive bg-destructive/5", icon: XCircle },
};

const typeColor: Record<DoctorAppointment["type"], string> = {
  OPD: "bg-primary/10 text-primary",
  "Follow-up": "bg-accent/15 text-accent-foreground",
  Emergency: "bg-destructive/15 text-destructive",
  Tele: "bg-info/15 text-info-foreground",
};

function AppointmentCard({ appt }: { appt: DoctorAppointment }) {
  const s = statusStyle[appt.status];
  const isFuture = appt.date > todayISO;
  return (
    <Card className={`p-3 border-l-4 ${s.cls}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />{appt.time}
            </span>
            <Badge variant="outline" className={typeColor[appt.type]}>{appt.type}</Badge>
            <Badge variant="outline">{appt.status}</Badge>
          </div>
          <p className="font-medium mt-1.5 flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{appt.patient}</p>
          <p className="text-xs text-muted-foreground">
            {appt.gender}, {appt.age} • <span className="font-mono">{appt.patientId}</span>
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Phone className="h-3 w-3" />{appt.mobile}
          </p>
          <p className="text-xs mt-1.5 flex items-start gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
            <span>{appt.reason}</span>
          </p>
          {appt.notes && (
            <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1.5">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              <span>{appt.notes}</span>
            </p>
          )}
        </div>
      </div>
      {isFuture && (
        <div className="flex gap-2 mt-3 pt-3 border-t">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`Reminder sent to ${appt.patient}`)}>
            Send reminder
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info(`Reschedule for ${appt.patient}`)}>
            Reschedule
          </Button>
        </div>
      )}
    </Card>
  );
}

function MiniStat({ label, value, icon: Icon, tone }: { label: string; value: number; icon: any; tone: "primary" | "accent" | "muted" }) {
  const toneCls = tone === "primary" ? "bg-primary/10 text-primary" : tone === "accent" ? "bg-accent/15 text-accent-foreground" : "bg-muted text-muted-foreground";
  return (
    <Card className="p-3 text-center">
      <div className={`mx-auto h-9 w-9 rounded-full grid place-items-center ${toneCls}`}><Icon className="h-4 w-4" /></div>
      <p className="text-xl font-bold mt-2">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </Card>
  );
}
