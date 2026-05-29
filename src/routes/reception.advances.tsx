import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { admissions, advanceLedger, currency, type AdvanceEntry, type AdvanceReason, type AdvanceMode } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Receipt, Wallet, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/reception/advances")({
  component: AdvancesPage,
});

const REASONS: AdvanceReason[] = [
  "Admission Advance",
  "Blood / Transfusion",
  "Lab / Diagnostic Test",
  "Radiology (X-Ray/CT/MRI)",
  "Medicine",
  "Surgery / OT",
  "ICU Charges",
  "Other",
];
const MODES: AdvanceMode[] = ["Cash", "UPI", "Card", "Insurance", "Bank Transfer"];

const reasonTone: Record<AdvanceReason, string> = {
  "Admission Advance": "bg-primary/10 text-primary",
  "Blood / Transfusion": "bg-destructive/10 text-destructive",
  "Lab / Diagnostic Test": "bg-accent/40 text-foreground",
  "Radiology (X-Ray/CT/MRI)": "bg-accent/40 text-foreground",
  "Medicine": "bg-secondary text-secondary-foreground",
  "Surgery / OT": "bg-destructive/10 text-destructive",
  "ICU Charges": "bg-destructive/10 text-destructive",
  "Other": "bg-muted text-muted-foreground",
};

function AdvancesPage() {
  const [ledger, setLedger] = useState<AdvanceEntry[]>(advanceLedger);
  const [filterAdm, setFilterAdm] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // form
  const todayISO = new Date().toISOString().slice(0, 10);
  const [admissionId, setAdmissionId] = useState<string>(admissions[0]?.id ?? "");
  const [date, setDate] = useState(todayISO);
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<AdvanceReason>("Admission Advance");
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<AdvanceMode>("Cash");
  const [ref, setRef] = useState("");

  const filtered = useMemo(() => {
    return ledger
      .filter((e) => (filterAdm === "all" ? true : e.admissionId === filterAdm))
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          e.patient.toLowerCase().includes(q) ||
          e.admissionId.toLowerCase().includes(q) ||
          e.reason.toLowerCase().includes(q) ||
          e.ref.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
  }, [ledger, filterAdm, search]);

  const totals = useMemo(() => {
    const list = filterAdm === "all" ? ledger : ledger.filter((e) => e.admissionId === filterAdm);
    const totalAdv = list.reduce((s, e) => s + e.amount, 0);
    const today = list.filter((e) => e.date === todayISO).reduce((s, e) => s + e.amount, 0);
    const initial = list.filter((e) => e.reason === "Admission Advance").reduce((s, e) => s + e.amount, 0);
    return { totalAdv, today, initial, addOn: totalAdv - initial, count: list.length };
  }, [ledger, filterAdm, todayISO]);

  const reset = () => {
    setAmount(0);
    setNote("");
    setRef("");
    setReason("Admission Advance");
    setMode("Cash");
    setDate(todayISO);
    setTime(new Date().toTimeString().slice(0, 5));
  };

  const save = () => {
    if (!admissionId) return toast.error("Select admission");
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    if (!ref.trim()) return toast.error("Receipt / Txn reference required");
    const adm = admissions.find((a) => a.id === admissionId);
    const entry: AdvanceEntry = {
      id: `ADV-${1000 + ledger.length + 1}`,
      admissionId,
      patient: adm?.patient ?? "",
      date,
      time,
      amount,
      reason,
      note: note.trim() || undefined,
      mode,
      ref: ref.trim(),
      collectedBy: "Anita Singh",
    };
    setLedger((prev) => [entry, ...prev]);
    toast.success(`Advance ${currency(amount)} recorded · ${reason}`);
    reset();
    setOpen(false);
  };

  return (
    <PortalShell role="reception" title="Advance Payments">
      <div className="grid gap-4 md:grid-cols-4">
        <StatTile icon={<Wallet className="h-4 w-4" />} label="Total Advances" value={currency(totals.totalAdv)} />
        <StatTile icon={<Receipt className="h-4 w-4" />} label="Initial Admission" value={currency(totals.initial)} />
        <StatTile icon={<Plus className="h-4 w-4" />} label="Add-on Advances" value={currency(totals.addOn)} />
        <StatTile icon={<AlertCircle className="h-4 w-4" />} label="Collected Today" value={currency(totals.today)} />
      </div>

      <Card className="p-5 shadow-card mt-5">
        <div className="flex flex-wrap items-end gap-3 justify-between">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1.5 min-w-[220px]">
              <Label>Admission</Label>
              <Select value={filterAdm} onValueChange={setFilterAdm}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All admissions</SelectItem>
                  {admissions.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.id} · {a.patient}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 min-w-[220px]">
              <Label>Search</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input className="pl-8" placeholder="Patient, reason, receipt…" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary"><Plus className="h-4 w-4 mr-1" /> Collect Advance</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Collect Advance Payment</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2">
                  <Label>Admission</Label>
                  <Select value={admissionId} onValueChange={setAdmissionId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {admissions.map((a) => (
                        <SelectItem key={a.id} value={a.id}>{a.id} · {a.patient} · {a.ward} {a.bed}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Amount (₹)</Label>
                  <Input type="number" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value) || 0)} placeholder="e.g. 2500" />
                </div>
                <div className="space-y-1.5">
                  <Label>Reason</Label>
                  <Select value={reason} onValueChange={(v) => setReason(v as AdvanceReason)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Mode</Label>
                  <Select value={mode} onValueChange={(v) => setMode(v as AdvanceMode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Receipt / Txn Ref</Label>
                  <Input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="RCT-XXXX / TXN-XXXX" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Note (optional)</Label>
                  <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. 1 unit B+ blood, CBC + LFT…" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-primary" onClick={save}>Save Advance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4 rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Admission</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No advance payments found.</TableCell></TableRow>
              )}
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">
                    <div>{e.id}</div>
                    <div className="text-muted-foreground">{e.ref}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{e.date}</div>
                    <div className="text-xs text-muted-foreground">{e.time} · {e.collectedBy}</div>
                  </TableCell>
                  <TableCell className="font-medium">{e.patient}</TableCell>
                  <TableCell className="font-mono text-xs">{e.admissionId}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={reasonTone[e.reason]}>{e.reason}</Badge>
                    {e.note && <div className="text-xs text-muted-foreground mt-1">{e.note}</div>}
                  </TableCell>
                  <TableCell>{e.mode}</TableCell>
                  <TableCell className="text-right font-semibold">{currency(e.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filterAdm !== "all" && (
          <div className="mt-3 flex justify-end text-sm">
            <div className="rounded-md border px-3 py-2 bg-muted/40">
              <span className="text-muted-foreground mr-2">Total advances for {filterAdm}:</span>
              <span className="font-semibold">{currency(totals.totalAdv)}</span>
              <span className="text-muted-foreground ml-2">({totals.count} entries)</span>
            </div>
          </div>
        )}
      </Card>
    </PortalShell>
  );
}

function StatTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="p-4 shadow-card">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </Card>
  );
}
