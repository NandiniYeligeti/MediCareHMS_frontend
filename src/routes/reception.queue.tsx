import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatCard, StatusPill } from "@/components/StatCard";
import { receptionQueue, doctors, todayISO, formatTime12, QueueEntry } from "@/lib/mock-data";
import { toast } from "sonner";
import { Send, Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, Users, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/reception/queue")({
  component: QueuePage,
});

function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
}

function shiftDate(d: string, days: number) {
  const dt = new Date(d + "T00:00:00");
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().slice(0, 10);
}

function QueuePage() {
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [rescheduleTarget, setRescheduleTarget] = useState<QueueEntry | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [, force] = useState(0);

  const isToday = selectedDate === todayISO;
  const isPast = selectedDate < todayISO;
  const isFuture = selectedDate > todayISO;

  const filtered = useMemo(() => {
    let list = receptionQueue.filter((q) => q.date === selectedDate);
    if (doctorFilter !== "all") list = list.filter((q) => q.doctor === doctorFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((q) => q.patient.toLowerCase().includes(s) || q.patientId.toLowerCase().includes(s) || q.mobile.includes(s));
    }
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, doctorFilter, search]);

  const stats = useMemo(() => ({
    total: filtered.length,
    done: filtered.filter((q) => q.status === "Done").length,
    waiting: filtered.filter((q) => q.status === "Waiting" || q.status === "In Consultation").length,
    scheduled: filtered.filter((q) => q.status === "Scheduled").length,
    missed: filtered.filter((q) => q.status === "Missed").length,
    cancelled: filtered.filter((q) => q.status === "Cancelled").length,
  }), [filtered]);

  const sendPatient = (q: QueueEntry) => toast.success(`Sent token #${q.token} (${q.patient}) to ${q.doctor}`);

  const openReschedule = (q: QueueEntry) => {
    setRescheduleTarget(q);
    setNewDate(q.date >= todayISO ? q.date : todayISO);
    setNewTime(q.time);
  };

  const confirmReschedule = () => {
    if (!rescheduleTarget || !newDate || !newTime) {
      toast.error("Please pick a date and time");
      return;
    }
    const idx = receptionQueue.findIndex(
      (q) => q.date === rescheduleTarget.date && q.doctor === rescheduleTarget.doctor && q.token === rescheduleTarget.token
    );
    if (idx >= 0) {
      receptionQueue[idx] = { ...receptionQueue[idx], date: newDate, time: newTime, status: "Scheduled" };
    }
    toast.success(`${rescheduleTarget.patient} rescheduled to ${fmtDate(newDate)} at ${formatTime12(newTime)}`);
    setRescheduleTarget(null);
    force((n) => n + 1);
  };

  return (
    <PortalShell role="reception" title="Queue Management">
      <div className="space-y-4">
        {/* Date selector */}
        <Card className="p-4 shadow-card">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <label className="text-xs text-muted-foreground">Appointment Date</label>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value || todayISO)} className="w-44" />
              </div>
              <Button variant="outline" size="icon" onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(todayISO)}>Today</Button>
            </div>
            <div className="flex-1 flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span className="font-semibold">{fmtDate(selectedDate)}</span>
              {isToday && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground">TODAY</span>}
              {isPast && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted">PAST</span>}
              {isFuture && <span className="text-[10px] px-2 py-0.5 rounded-full bg-info/20 text-info">UPCOMING</span>}
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total" value={stats.total} icon={<Users className="h-4 w-4" />} />
          <StatCard label="Done" value={stats.done} icon={<CheckCircle2 className="h-4 w-4" />} accent="success" />
          {isToday ? (
            <StatCard label="Waiting" value={stats.waiting} icon={<Clock className="h-4 w-4" />} accent="warning" />
          ) : (
            <StatCard label="Scheduled" value={stats.scheduled} icon={<CalendarIcon className="h-4 w-4" />} accent="info" />
          )}
          <StatCard label="Missed" value={stats.missed} icon={<XCircle className="h-4 w-4" />} accent="destructive" />
          <StatCard label="Cancelled" value={stats.cancelled} icon={<RotateCcw className="h-4 w-4" />} />
        </div>

        {/* Filters */}
        <Card className="p-4 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground">Search patient / ID / mobile</label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to search…" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Doctor</label>
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All doctors</SelectItem>
                  {doctors.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="p-0 shadow-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-10">No appointments for this date.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Token</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => (
                  <TableRow key={`${q.date}-${q.doctor}-${q.token}`}>
                    <TableCell className="font-mono font-bold">#{q.token}</TableCell>
                    <TableCell>
                      <div className="font-medium">{q.patient}</div>
                      <div className="text-xs text-muted-foreground">{q.patientId} · {q.mobile}</div>
                    </TableCell>
                    <TableCell className="text-sm">{q.doctor}</TableCell>
                    <TableCell className="text-sm">{formatTime12(q.time)}</TableCell>
                    <TableCell><StatusPill status={q.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {isToday && q.status === "Waiting" && (
                          <Button size="sm" onClick={() => sendPatient(q)} className="bg-gradient-primary">
                            <Send className="h-3.5 w-3.5 mr-1" /> Send
                          </Button>
                        )}
                        {q.status !== "Done" && q.status !== "Cancelled" && (
                          <Button size="sm" variant="outline" onClick={() => openReschedule(q)}>
                            <RotateCcw className="h-3.5 w-3.5 mr-1" />Reschedule
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleTarget} onOpenChange={(o) => !o && setRescheduleTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          {rescheduleTarget && (
            <div className="space-y-3">
              <div className="text-sm bg-muted/40 rounded p-3">
                <div className="font-medium">{rescheduleTarget.patient} · #{rescheduleTarget.token}</div>
                <div className="text-xs text-muted-foreground">{rescheduleTarget.doctor}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {fmtDate(rescheduleTarget.date)} at {formatTime12(rescheduleTarget.time)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">New Date</label>
                  <Input type="date" min={todayISO} value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">New Time</label>
                  <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleTarget(null)}>Cancel</Button>
            <Button onClick={confirmReschedule} className="bg-gradient-primary">Confirm Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalShell>
  );
}
