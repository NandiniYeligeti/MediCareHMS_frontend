import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  opdRecords, admissionRecords, collectionRecords, wardOccupancyRows,
  currency, dischargeStore, type DischargeRecord,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { Download, FileText, Pencil, History, Stethoscope, BedDouble, LogOut, Wallet, Building2 } from "lucide-react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reports/")({
  component: ReportsPage,
});

const REPORTS = [
  { key: "opd", label: "OPD Report", icon: Stethoscope },
  { key: "admissions", label: "Admissions", icon: BedDouble },
  { key: "discharges", label: "Discharges", icon: LogOut },
  { key: "collection", label: "Daily Collection", icon: Wallet },
  { key: "occupancy", label: "Ward Occupancy", icon: Building2 },
] as const;

function ReportsPage() {
  const { session } = useAuth();
  const role = session?.role === "management" ? "management" : "reception";
  const [tab, setTab] = useState<(typeof REPORTS)[number]["key"]>("opd");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const discharges = useSyncExternalStore(dischargeStore.subscribe, dischargeStore.list, dischargeStore.list);
  const audit = useSyncExternalStore(dischargeStore.subscribe, dischargeStore.audit, dischargeStore.audit);

  const inRange = (d: string) => (!from || d >= from) && (!to || d <= to);

  const opd = useMemo(() => opdRecords.filter((r) => inRange(r.date)), [from, to]);
  const adm = useMemo(() => admissionRecords.filter((r) => inRange(r.admittedOn)), [from, to]);
  const dsc = useMemo(() => discharges.filter((r) => inRange(r.dischargedOn)), [from, to, discharges]);
  const col = useMemo(() => collectionRecords.filter((r) => inRange(r.date)), [from, to]);

  const totals = {
    opd: opd.length,
    adm: adm.length,
    dsc: dsc.length,
    col: col.reduce((s, r) => s + r.amount, 0),
  };

  return (
    <PortalShell role={role as "management" | "reception"} title="Reports">
      <div className="space-y-6">
        {/* Filters */}
        <Card className="p-5 shadow-card">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5"><Label>From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
            <Button variant="outline" onClick={() => { setFrom(""); setTo(""); }}>Reset</Button>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={() => toast.success("Export queued")}><Download className="h-4 w-4 mr-1" />Export CSV</Button>
            </div>
          </div>
        </Card>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatTile icon={Stethoscope} label="OPD Visits" value={totals.opd} />
          <StatTile icon={BedDouble} label="Admissions" value={totals.adm} />
          <StatTile icon={LogOut} label="Discharges" value={totals.dsc} />
          <StatTile icon={Wallet} label="Collection" value={currency(totals.col)} accent />
        </div>

        {/* Reports tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="flex flex-wrap h-auto">
            {REPORTS.map((r) => (
              <TabsTrigger key={r.key} value={r.key} className="gap-1.5">
                <r.icon className="h-4 w-4" />{r.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="opd" className="mt-4">
            <ReportCard title="OPD Report" count={opd.length}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>OPD ID</TableHead><TableHead>Date</TableHead><TableHead>Token</TableHead>
                    <TableHead>Patient</TableHead><TableHead>Doctor</TableHead><TableHead>Dept</TableHead>
                    <TableHead className="text-right">Fee</TableHead><TableHead>Status</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {opd.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>#{r.token}</TableCell>
                        <TableCell className="font-medium">{r.patient}</TableCell>
                        <TableCell>{r.doctor}</TableCell>
                        <TableCell>{r.department}</TableCell>
                        <TableCell className="text-right">{currency(r.fee)}</TableCell>
                        <TableCell><StatusBadge value={r.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ReportCard>
          </TabsContent>

          <TabsContent value="admissions" className="mt-4">
            <ReportCard title="Admissions Report" count={adm.length}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>ADM ID</TableHead><TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead><TableHead>Ward</TableHead><TableHead>Bed</TableHead>
                    <TableHead>Admitted On</TableHead><TableHead className="text-right">Advance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {adm.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell className="font-medium">{r.patient}</TableCell>
                        <TableCell>{r.doctor}</TableCell>
                        <TableCell>{r.ward}</TableCell>
                        <TableCell>{r.bed}</TableCell>
                        <TableCell>{r.admittedOn}</TableCell>
                        <TableCell className="text-right">{currency(r.advance)}</TableCell>
                        <TableCell><StatusBadge value={r.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ReportCard>
          </TabsContent>

          <TabsContent value="discharges" className="mt-4">
            <DischargeReport rows={dsc} canEdit={role === "reception" || role === "management"} />
          </TabsContent>

          <TabsContent value="collection" className="mt-4">
            <ReportCard title="Daily Collection" count={col.length} extra={<span className="text-sm font-semibold text-primary">Total: {currency(totals.col)}</span>}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Receipt</TableHead><TableHead>Date</TableHead><TableHead>Patient</TableHead>
                    <TableHead>Purpose</TableHead><TableHead>Mode</TableHead><TableHead>Ref</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {col.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-mono text-xs">{r.id}</TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell className="font-medium">{r.patient}</TableCell>
                        <TableCell>{r.purpose}</TableCell>
                        <TableCell><Badge variant="secondary">{r.mode}</Badge></TableCell>
                        <TableCell className="font-mono text-xs">{r.ref}</TableCell>
                        <TableCell className="text-right font-semibold">{currency(r.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ReportCard>
          </TabsContent>

          <TabsContent value="occupancy" className="mt-4">
            <ReportCard title="Ward Occupancy" count={wardOccupancyRows.length}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Ward</TableHead><TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Occupied</TableHead><TableHead className="text-right">Reserved</TableHead>
                    <TableHead className="text-right">Available</TableHead><TableHead className="text-right">Occupancy</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {wardOccupancyRows.map((r) => (
                      <TableRow key={r.ward}>
                        <TableCell className="font-medium">{r.ward}</TableCell>
                        <TableCell className="text-right">{r.total}</TableCell>
                        <TableCell className="text-right">{r.occupied}</TableCell>
                        <TableCell className="text-right">{r.reserved}</TableCell>
                        <TableCell className="text-right">{r.available}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={r.occupancyPct > 80 ? "destructive" : "secondary"}>{r.occupancyPct}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ReportCard>
          </TabsContent>
        </Tabs>

        {/* Global audit log preview */}
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <History className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Discharge Edit Log</h2>
            <Badge variant="secondary" className="ml-auto">{audit.length} entries</Badge>
          </div>
          {audit.length === 0 ? (
            <p className="text-sm text-muted-foreground">No edits recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>When</TableHead><TableHead>Discharge</TableHead><TableHead>Field</TableHead>
                  <TableHead>Old</TableHead><TableHead>New</TableHead>
                  <TableHead>By</TableHead><TableHead>Reason</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {[...audit].sort((a, b) => b.changedAt.localeCompare(a.changedAt)).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-xs whitespace-nowrap">{a.changedAt.replace("T", " ")}</TableCell>
                      <TableCell className="font-mono text-xs">{a.dischargeId}</TableCell>
                      <TableCell><Badge variant="outline">{a.field}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground line-through">{a.oldValue}</TableCell>
                      <TableCell className="text-xs font-medium">{a.newValue}</TableCell>
                      <TableCell className="text-xs">{a.changedBy}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </PortalShell>
  );
}

function StatTile({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent?: boolean }) {
  return (
    <Card className="p-4 shadow-card">
      <Icon className={`h-6 w-6 ${accent ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-xs uppercase tracking-wide text-muted-foreground mt-2">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ? "text-primary" : ""}`}>{value}</p>
    </Card>
  );
}

function ReportCard({ title, count, extra, children }: { title: string; count: number; extra?: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="p-5 shadow-card">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">{title}</h2>
        <Badge variant="secondary">{count}</Badge>
        <div className="ml-auto flex items-center gap-3">
          {extra}
          <Button size="sm" variant="outline" onClick={() => toast.success("Exported")}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </div>
      {children}
    </Card>
  );
}

function StatusBadge({ value }: { value: string }) {
  const v = value.toLowerCase();
  const variant: any = v === "completed" || v === "discharged" ? "default" : v === "missed" ? "destructive" : "secondary";
  return <Badge variant={variant}>{value}</Badge>;
}

// ===== Discharge report with editing + per-row history =====
function DischargeReport({ rows, canEdit }: { rows: DischargeRecord[]; canEdit: boolean }) {
  const [editing, setEditing] = useState<DischargeRecord | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);

  return (
    <>
      <ReportCard title="Discharges Report" count={rows.length}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>DSC ID</TableHead><TableHead>Patient</TableHead><TableHead>Doctor</TableHead>
              <TableHead>Ward</TableHead><TableHead>Admitted</TableHead><TableHead>Discharged</TableHead>
              <TableHead className="text-right">Days</TableHead><TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Balance</TableHead><TableHead>Mode</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.patient}</TableCell>
                  <TableCell>{r.doctor}</TableCell>
                  <TableCell>{r.ward} / {r.bed}</TableCell>
                  <TableCell>{r.admittedOn}</TableCell>
                  <TableCell>{r.dischargedOn}</TableCell>
                  <TableCell className="text-right">{r.days}</TableCell>
                  <TableCell className="text-right font-semibold">{currency(r.total)}</TableCell>
                  <TableCell className="text-right">
                    <span className={r.balance > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}>{currency(r.balance)}</span>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{r.paymentMode}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setHistoryId(r.id)}>
                        <History className="h-3.5 w-3.5" />
                      </Button>
                      {canEdit && (
                        <Button size="sm" variant="outline" onClick={() => setEditing(r)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ReportCard>

      <EditDischargeDialog record={editing} onClose={() => setEditing(null)} />
      <HistoryDialog dischargeId={historyId} onClose={() => setHistoryId(null)} />
    </>
  );
}

function EditDischargeDialog({ record, onClose }: { record: DischargeRecord | null; onClose: () => void }) {
  const { session } = useAuth();
  const [form, setForm] = useState<DischargeRecord | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => { setForm(record ? { ...record } : null); setReason(""); }, [record]);

  if (!form || !record) return null;

  const total = form.wardCharges + form.doctorCharges + form.medicine + form.lab + form.other;
  const balance = total - form.advance;

  const save = () => {
    if (!reason.trim()) { toast.error("Reason for change is required"); return; }
    const changes: Partial<DischargeRecord> = {};
    (Object.keys(form) as (keyof DischargeRecord)[]).forEach((k) => {
      if (String(form[k]) !== String(record[k])) (changes as any)[k] = form[k];
    });
    if (Object.keys(changes).length === 0) { toast.info("No changes to save"); return; }
    dischargeStore.update(record.id, changes, {
      changedBy: `${session?.username || "User"} (${session?.role || "reception"})`,
      reason: reason.trim(),
    });
    toast.success(`Updated ${record.id} • ${Object.keys(changes).length} field(s)`);
    onClose();
  };

  return (
    <Dialog open={!!record} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Discharge — {record.id}</DialogTitle>
          <DialogDescription>{record.patient} • {record.ward} / {record.bed}. All edits are logged.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Discharge Date"><Input type="date" value={form.dischargedOn} onChange={(e) => setForm({ ...form, dischargedOn: e.target.value })} /></Field>
          <Field label="Days"><Input type="number" value={form.days} onChange={(e) => setForm({ ...form, days: Number(e.target.value) || 0 })} /></Field>
          <Field label="Ward Charges"><Input type="number" value={form.wardCharges} onChange={(e) => setForm({ ...form, wardCharges: Number(e.target.value) || 0 })} /></Field>
          <Field label="Doctor Charges"><Input type="number" value={form.doctorCharges} onChange={(e) => setForm({ ...form, doctorCharges: Number(e.target.value) || 0 })} /></Field>
          <Field label="Medicine"><Input type="number" value={form.medicine} onChange={(e) => setForm({ ...form, medicine: Number(e.target.value) || 0 })} /></Field>
          <Field label="Lab"><Input type="number" value={form.lab} onChange={(e) => setForm({ ...form, lab: Number(e.target.value) || 0 })} /></Field>
          <Field label="Other"><Input type="number" value={form.other} onChange={(e) => setForm({ ...form, other: Number(e.target.value) || 0 })} /></Field>
          <Field label="Advance"><Input type="number" value={form.advance} onChange={(e) => setForm({ ...form, advance: Number(e.target.value) || 0 })} /></Field>
          <Field label="Payment Mode">
            <Select value={form.paymentMode} onValueChange={(v) => setForm({ ...form, paymentMode: v as DischargeRecord["paymentMode"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Cash", "UPI", "Card", "Insurance"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="space-y-1.5">
          <Label>Discharge Notes</Label>
          <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>

        <Card className="p-3 bg-muted/40">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">New Total</span><span className="font-semibold">{currency(total)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">New Balance</span><span className={`font-semibold ${balance > 0 ? "text-destructive" : ""}`}>{currency(balance)}</span></div>
        </Card>

        <div className="space-y-1.5">
          <Label>Reason for change <span className="text-destructive">*</span></Label>
          <Textarea rows={2} placeholder="e.g. Pharmacy bill reconciled, patient paid balance in cash..." value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-gradient-primary" onClick={save}>Save & Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({ dischargeId, onClose }: { dischargeId: string | null; onClose: () => void }) {
  const entries = useSyncExternalStore(dischargeStore.subscribe, dischargeStore.audit, dischargeStore.audit);
  if (!dischargeId) return null;
  const list = entries.filter((e) => e.dischargeId === dischargeId).sort((a, b) => b.changedAt.localeCompare(a.changedAt));
  return (
    <Dialog open={!!dischargeId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit History — {dischargeId}</DialogTitle>
          <DialogDescription>Every modification is timestamped and attributed.</DialogDescription>
        </DialogHeader>
        {list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No edits recorded for this discharge.</p>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {list.map((e) => (
              <div key={e.id} className="border rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{e.field}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">{e.changedAt.replace("T", " ")}</span>
                </div>
                <div className="mt-2 flex gap-2 items-center text-xs">
                  <span className="line-through text-muted-foreground">{e.oldValue}</span>
                  <span>→</span>
                  <span className="font-semibold">{e.newValue}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">By <span className="font-medium text-foreground">{e.changedBy}</span> • {e.reason}</div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
