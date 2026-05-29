import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doctorSchedule, todayISO } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { CalendarDays, Search, CheckCircle2, XCircle, User, Clock, FileText } from "lucide-react";

export const Route = createFileRoute("/doctor/history")({
  component: DoctorHistory,
});

function DoctorHistory() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [query, setQuery] = useState("");

  const past = useMemo(() => {
    let list = doctorSchedule.filter(a => a.date < todayISO);
    if (from) list = list.filter(a => a.date >= from);
    if (to) list = list.filter(a => a.date <= to);
    if (status !== "all") list = list.filter(a => a.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(a => a.patient.toLowerCase().includes(q) || a.patientId.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q));
    }
    return list.sort((a, b) => a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date));
  }, [from, to, status, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof past>();
    past.forEach(a => {
      const arr = map.get(a.date) || [];
      arr.push(a);
      map.set(a.date, arr);
    });
    return Array.from(map.entries());
  }, [past]);

  const totalDone = past.filter(a => a.status === "Done").length;
  const totalMissed = past.filter(a => a.status === "Missed").length;

  return (
    <MobileShell title="Consultation History">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center"><p className="text-xl font-bold">{past.length}</p><p className="text-[11px] text-muted-foreground">Total</p></Card>
          <Card className="p-3 text-center"><p className="text-xl font-bold text-success">{totalDone}</p><p className="text-[11px] text-muted-foreground">Completed</p></Card>
          <Card className="p-3 text-center"><p className="text-xl font-bold text-destructive">{totalMissed}</p><p className="text-[11px] text-muted-foreground">Missed</p></Card>
        </div>

        <Card className="p-3 md:p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patient, ID or reason..." className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">From</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Done">Completed</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={() => { setFrom(""); setTo(""); setStatus("all"); setQuery(""); }}>
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {grouped.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No past consultations match your filters
          </Card>
        ) : (
          <div className="space-y-4">
            {grouped.map(([date, items]) => {
              const d = new Date(date);
              const label = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });
              return (
                <div key={date}>
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />{label}
                    </p>
                    <span className="text-xs text-muted-foreground">{items.length} consult{items.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {items.map(h => (
                      <Card key={h.id} className={`p-3 border-l-4 ${h.status === "Done" ? "border-l-success" : "border-l-destructive"}`}>
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{h.patient}</p>
                            <p className="text-xs text-muted-foreground">
                              {h.gender}, {h.age} • <span className="font-mono">{h.patientId}</span>
                            </p>
                            <p className="text-xs mt-1.5"><span className="text-muted-foreground">Reason:</span> {h.reason}</p>
                            {h.notes && <p className="text-xs text-muted-foreground mt-0.5">Notes: {h.notes}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <Badge variant="outline" className="text-xs"><Clock className="h-3 w-3 mr-1" />{h.time}</Badge>
                            <Badge className={h.status === "Done" ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}>
                              {h.status === "Done" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                              {h.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{h.type}</Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MobileShell>
  );
}
