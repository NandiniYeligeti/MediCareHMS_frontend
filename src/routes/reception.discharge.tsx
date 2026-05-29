import { createFileRoute, Link } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { admissions, advanceLedger, currency } from "@/lib/mock-data";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Printer, BedDouble, Receipt, AlertCircle, Lock, Eye } from "lucide-react";

const POLICY_KEY = "discharge.blockOnOutstanding";

export const Route = createFileRoute("/reception/discharge")({
  component: DischargePage,
});

function DischargePage() {
  const [adm, setAdm] = useState(admissions[0].id);
  const admission = admissions.find(a => a.id === adm)!;
  const [dischargeDate, setDischargeDate] = useState(new Date().toISOString().slice(0, 10));
  const [dischargeTime, setDischargeTime] = useState("12:00");
  const [type, setType] = useState("Recovered");
  const [followUp, setFollowUp] = useState("");
  const [summaryNotes, setSummaryNotes] = useState("");
  const [medicines, setMedicines] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const totalAdvance = useMemo(
    () => advanceLedger.filter(a => a.admissionId === adm).reduce((s, a) => s + a.amount, 0),
    [adm]
  );
  // Demo balance — actual figure comes from Billing module
  const estimatedBill = 18500;
  const balance = Math.max(0, estimatedBill - totalAdvance);
  const cleared = balance === 0;

  const [blockOnOutstanding, setBlockOnOutstanding] = useState(true);
  useEffect(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem(POLICY_KEY) : null;
    if (v !== null) setBlockOnOutstanding(v === "1");
  }, []);
  const togglePolicy = (v: boolean) => {
    setBlockOnOutstanding(v);
    localStorage.setItem(POLICY_KEY, v ? "1" : "0");
    toast.success(v ? "Policy ON: discharge blocked when bill outstanding" : "Policy OFF: discharge allowed with override");
  };

  const canDischarge = cleared || !blockOnOutstanding;

  const handleDischarge = () => {
    if (!cleared && blockOnOutstanding) {
      toast.error(`Cannot discharge — outstanding ${currency(balance)}. Clear bill in Billing first.`);
      return;
    }
    if (!cleared && !blockOnOutstanding) {
      const ok = window.confirm(`Outstanding balance is ${currency(balance)}. Discharge anyway? This will be logged.`);
      if (!ok) return;
      toast.warning("Discharged with outstanding balance (override logged).");
    } else {
      toast.success("Patient discharged. Bed released.");
    }
  };

  return (
    <PortalShell role="reception" title="Patient Discharge">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 shadow-card lg:col-span-2 space-y-5">
          <div>
            <h2 className="font-semibold">Step 1 — Select Admission</h2>
            <Select value={adm} onValueChange={setAdm}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {admissions.map(a => (
                  <SelectItem key={a.id} value={a.id}>{a.id} — {a.patient} ({a.ward}/{a.bed})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Discharge Date</Label>
              <Input type="date" value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Discharge Time</Label>
              <Input type="time" value={dischargeTime} onChange={(e) => setDischargeTime(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label>Discharge Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Recovered">Recovered</SelectItem>
                <SelectItem value="LAMA">LAMA (Left Against Medical Advice)</SelectItem>
                <SelectItem value="Referred">Referred to Other Hospital</SelectItem>
                <SelectItem value="Death">Death</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Discharge Summary Notes</Label>
            <Textarea className="mt-1.5" placeholder="Diagnosis, treatment given, condition at discharge..." rows={3} value={summaryNotes} onChange={(e) => setSummaryNotes(e.target.value)} />
          </div>

          <div>
            <Label>Medicines on Discharge</Label>
            <Textarea className="mt-1.5" placeholder="Tab. Paracetamol 500mg — 1-0-1 × 5 days" rows={2} value={medicines} onChange={(e) => setMedicines(e.target.value)} />
          </div>

          <div>
            <Label>Follow-up Date</Label>
            <Input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className="mt-1.5" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              className="bg-gradient-primary"
              disabled={!canDischarge}
              onClick={handleDischarge}
            >
              {!canDischarge && <Lock className="h-4 w-4 mr-1" />}
              {canDischarge && <BedDouble className="h-4 w-4 mr-1" />}
              Confirm Discharge
            </Button>
            <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-1" />Preview Summary
            </Button>
            <Button variant="outline" onClick={() => toast.success("Sent to printer")}>
              <Printer className="h-4 w-4 mr-1" />Print Summary
            </Button>
          </div>
          {!cleared && blockOnOutstanding && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Discharge blocked — outstanding balance {currency(balance)}.</p>
                <p className="mt-0.5">Clear the bill in the Billing tab, then return here to discharge.</p>
              </div>
            </div>
          )}
          {!cleared && !blockOnOutstanding && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Override mode: discharge allowed with outstanding {currency(balance)}.
            </p>
          )}
        </Card>

        <Card className="p-5 shadow-card h-fit space-y-3">
          <h2 className="font-semibold">Billing Status</h2>
          <p className="text-xs text-muted-foreground">{admission.patient} • {admission.id}</p>
          <div className="space-y-2 text-sm">
            <Row k="Estimated Bill" v={currency(estimatedBill)} />
            <Row k="Advance Paid" v={currency(totalAdvance)} />
            <div className="border-t pt-2">
              <Row k="Balance" v={currency(balance)} bold accent={balance > 0} />
            </div>
          </div>
          <Badge variant={cleared ? "default" : "destructive"} className="w-full justify-center py-1.5">
            {cleared ? "Cleared — ready to discharge" : "Pending payment"}
          </Badge>
          <Link to="/reception/billing">
            <Button variant="outline" className="w-full">
              <Receipt className="h-4 w-4 mr-1" />Go to Billing
            </Button>
          </Link>

          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold">Block discharge if bill outstanding</p>
                <p className="text-[11px] text-muted-foreground">Recommended ON</p>
              </div>
              <Switch checked={blockOnOutstanding} onCheckedChange={togglePolicy} />
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Charges (ward, doctor, medicines, tests) are managed in the Billing tab.
            This screen handles only the clinical discharge & bed release.
          </p>
        </Card>

      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Discharge Summary — Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="text-center border-b pb-3">
              <h3 className="font-bold text-base">MediCare Hospital</h3>
              <p className="text-xs text-muted-foreground">Discharge Summary</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <PvRow k="Patient" v={admission.patient} />
              <PvRow k="Admission ID" v={admission.id} />
              <PvRow k="Ward / Bed" v={`${admission.ward} / ${admission.bed}`} />
              <PvRow k="Discharge Type" v={type} />
              <PvRow k="Discharge Date" v={dischargeDate} />
              <PvRow k="Discharge Time" v={dischargeTime} />
              <PvRow k="Follow-up" v={followUp || "—"} />
            </div>
            <div>
              <p className="font-semibold text-xs text-muted-foreground uppercase">Summary Notes</p>
              <p className="mt-1 whitespace-pre-wrap">{summaryNotes || "—"}</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-muted-foreground uppercase">Medicines on Discharge</p>
              <p className="mt-1 whitespace-pre-wrap">{medicines || "—"}</p>
            </div>
            <div className="border-t pt-3 space-y-1">
              <p className="font-semibold text-xs text-muted-foreground uppercase">Billing</p>
              <Row k="Estimated Bill" v={currency(estimatedBill)} />
              <Row k="Advance Paid" v={currency(totalAdvance)} />
              <Row k="Balance" v={currency(balance)} bold accent={balance > 0} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button onClick={() => { toast.success("Sent to printer"); setPreviewOpen(false); }}>
              <Printer className="h-4 w-4 mr-1" />Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalShell>
  );
}

function PvRow({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground uppercase">{k}</p>
      <p className="font-medium">{v}</p>
    </div>
  );
}



function Row({ k, v, bold, accent }: { k: string; v: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
      <span className={accent ? "text-destructive" : "text-muted-foreground"}>{k}</span>
      <span className={accent ? "text-destructive" : ""}>{v}</span>
    </div>
  );
}
