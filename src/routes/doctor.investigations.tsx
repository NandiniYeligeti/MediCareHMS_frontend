import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { investigations, InvestigationCase, InvestigationTest } from "@/lib/mock-data";
import {
  FlaskConical, Activity, MapPin, Phone, CalendarDays, Stethoscope,
  AlertTriangle, FileText, Pill, Eye, Search, Heart, Thermometer, Droplet,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/doctor/investigations")({
  component: DoctorInvestigations,
});

const priorityStyle: Record<InvestigationCase["priority"], string> = {
  Critical: "bg-destructive text-destructive-foreground",
  Urgent: "bg-warning text-warning-foreground",
  Routine: "bg-muted text-muted-foreground",
};
const statusStyle: Record<InvestigationCase["status"], string> = {
  "Tests Pending": "border-l-warning bg-warning/5",
  "Awaiting Reports": "border-l-info bg-info/5",
  "Under Observation": "border-l-destructive bg-destructive/5",
  "Diagnosis Pending": "border-l-primary bg-primary/5",
};
const flagColor = (f?: InvestigationTest["flag"]) =>
  f === "Critical" ? "text-destructive font-semibold"
  : f === "Abnormal" ? "text-warning font-medium"
  : f === "Normal" ? "text-success" : "text-muted-foreground";
const testStatusColor = (s: InvestigationTest["status"]) =>
  s === "Reported" ? "bg-success/15 text-success"
  : s === "Awaiting Review" ? "bg-info/15 text-info"
  : s === "Sample Collected" ? "bg-primary/15 text-primary"
  : "bg-warning/15 text-warning";

function DoctorInvestigations() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | InvestigationCase["status"]>("all");

  const filtered = useMemo(() => {
    return investigations.filter((c) => {
      const matchQ = !q || [c.patient, c.patientId, c.provisionalDx, c.mobile].some(v => v.toLowerCase().includes(q.toLowerCase()));
      const matchTab = tab === "all" || c.status === tab;
      return matchQ && matchTab;
    });
  }, [q, tab]);

  const counts = {
    all: investigations.length,
    "Tests Pending": investigations.filter(i => i.status === "Tests Pending").length,
    "Awaiting Reports": investigations.filter(i => i.status === "Awaiting Reports").length,
    "Under Observation": investigations.filter(i => i.status === "Under Observation").length,
    "Diagnosis Pending": investigations.filter(i => i.status === "Diagnosis Pending").length,
  };
  const critical = investigations.filter(i => i.priority === "Critical").length;

  return (
    <MobileShell title="Patients Under Investigation">
      <div className="space-y-4">
        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <StatTile label="Active Cases" value={counts.all} icon={FlaskConical} tone="primary" />
          <StatTile label="Critical" value={critical} icon={AlertTriangle} tone="destructive" />
          <StatTile label="Awaiting Reports" value={counts["Awaiting Reports"]} icon={FileText} tone="info" />
          <StatTile label="Under Observation" value={counts["Under Observation"]} icon={Activity} tone="warning" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search patient, ID, diagnosis…" className="pl-9" />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="w-full flex-wrap h-auto">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="Tests Pending">Tests ({counts["Tests Pending"]})</TabsTrigger>
            <TabsTrigger value="Awaiting Reports">Reports ({counts["Awaiting Reports"]})</TabsTrigger>
            <TabsTrigger value="Under Observation">Observation ({counts["Under Observation"]})</TabsTrigger>
            <TabsTrigger value="Diagnosis Pending">Diagnosis ({counts["Diagnosis Pending"]})</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-3 space-y-3">
            {filtered.length === 0 && (
              <Card className="p-8 text-center text-muted-foreground text-sm">No matching investigations</Card>
            )}
            {filtered.map((c) => <CaseCard key={c.id} c={c} />)}
          </TabsContent>
        </Tabs>
      </div>
    </MobileShell>
  );
}

function StatTile({ label, value, icon: Icon, tone }: { label: string; value: number; icon: any; tone: "primary" | "destructive" | "info" | "warning" }) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-info/10 text-info",
    warning: "bg-warning/10 text-warning",
  }[tone];
  return (
    <Card className="p-3 flex items-center gap-3">
      <div className={`h-9 w-9 rounded-lg grid place-items-center ${toneCls}`}><Icon className="h-4 w-4" /></div>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-lg font-bold leading-tight">{value}</p>
      </div>
    </Card>
  );
}

function CaseCard({ c }: { c: InvestigationCase }) {
  const pending = c.tests.filter(t => t.status === "Pending" || t.status === "Sample Collected").length;
  const reported = c.tests.filter(t => t.status === "Reported" || t.status === "Awaiting Review").length;
  const abnormal = c.tests.filter(t => t.flag === "Abnormal" || t.flag === "Critical").length;

  return (
    <Card className={`p-4 border-l-4 shadow-soft ${statusStyle[c.status]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold truncate">{c.patient}</p>
            <span className="text-xs text-muted-foreground">{c.gender}, {c.age}</span>
            <Badge className={priorityStyle[c.priority]}>{c.priority}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{c.patientId} • {c.id}</p>
        </div>
        <Badge variant="outline" className="text-[10px] whitespace-nowrap">{c.status}</Badge>
      </div>

      <div className="mt-2 p-2 rounded-md bg-card border">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Provisional Dx</p>
        <p className="text-sm font-medium">{c.provisionalDx}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
        <InfoRow icon={MapPin} label={c.location + (c.ward ? ` • ${c.ward}/${c.bed}` : "")} />
        <InfoRow icon={Phone} label={c.mobile} />
        <InfoRow icon={CalendarDays} label={`Started ${c.startedOn}`} />
        <InfoRow icon={Stethoscope} label={`Review ${c.nextReview}`} />
      </div>

      {/* Vitals */}
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
        <Vital icon={Heart} label="BP" value={c.vitals.bp} />
        <Vital icon={Activity} label="Pulse" value={`${c.vitals.pulse}`} />
        <Vital icon={Thermometer} label="Temp" value={c.vitals.temp} />
        <Vital icon={Droplet} label="SpO₂" value={`${c.vitals.spo2}%`} />
      </div>

      {/* Test summary chips */}
      <div className="flex flex-wrap gap-1.5 mt-3 text-[11px]">
        <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning">Pending: {pending}</span>
        <span className="px-2 py-0.5 rounded-full bg-success/15 text-success">Reported: {reported}</span>
        {abnormal > 0 && <span className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">Abnormal: {abnormal}</span>}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="w-full mt-3">
            <Eye className="h-4 w-4 mr-1" /> View Full Investigation
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              {c.patient} — {c.id}
            </DialogTitle>
          </DialogHeader>
          <CaseDetails c={c} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function InfoRow({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}
function Vital({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-1.5">
      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
        <Icon className="h-3 w-3" />{label}
      </div>
      <p className="text-xs font-semibold">{value}</p>
    </div>
  );
}

function CaseDetails({ c }: { c: InvestigationCase }) {
  return (
    <div className="space-y-4 text-sm">
      <section>
        <h4 className="font-semibold text-xs text-muted-foreground uppercase mb-1">Symptoms</h4>
        <ul className="list-disc pl-5 space-y-0.5">{c.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </section>

      <section>
        <h4 className="font-semibold text-xs text-muted-foreground uppercase mb-2">Investigations Ordered</h4>
        <div className="border rounded-md divide-y">
          {c.tests.map((t, i) => (
            <div key={i} className="p-2.5 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">Ordered {t.orderedOn}</p>
                {t.result && <p className={`text-xs mt-0.5 ${flagColor(t.flag)}`}>→ {t.result}{t.flag ? ` (${t.flag})` : ""}</p>}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${testStatusColor(t.status)}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h4 className="font-semibold text-xs text-muted-foreground uppercase mb-1 flex items-center gap-1"><Pill className="h-3.5 w-3.5" /> Current Medications</h4>
        <ul className="list-disc pl-5 space-y-0.5">{c.medications.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </section>

      <section>
        <h4 className="font-semibold text-xs text-muted-foreground uppercase mb-1">Doctor's Notes</h4>
        <p className="p-2 rounded-md bg-muted/40 border text-xs">{c.notes}</p>
      </section>

      <div className="flex gap-2 pt-2">
        <Button size="sm" variant="outline" className="flex-1"><FileText className="h-4 w-4 mr-1" /> Add Note</Button>
        <Button size="sm" className="flex-1 bg-gradient-primary"><FlaskConical className="h-4 w-4 mr-1" /> Order Test</Button>
      </div>
    </div>
  );
}
