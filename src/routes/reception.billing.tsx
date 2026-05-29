import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { currency, admissions, advanceLedger } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reception/billing")({
  component: BillingPage,
});

function BillingPage() {
  const [admissionId, setAdmissionId] = useState<string>(admissions[0]?.id ?? "");
  const selected = useMemo(() => admissions.find(a => a.id === admissionId), [admissionId]);
  const collectedAdvance = useMemo(
    () => advanceLedger.filter(a => a.admissionId === admissionId).reduce((s, a) => s + a.amount, 0),
    [admissionId]
  );
  const [w, setW] = useState(7500);
  const [d, setD] = useState(2000);
  const [m, setM] = useState(3500);
  const [o, setO] = useState(500);
  const [adv, setAdv] = useState(collectedAdvance || 5000);
  const total = w + d + m + o;
  const balance = total - adv;

  const handleSelect = (id: string) => {
    setAdmissionId(id);
    const sum = advanceLedger.filter(a => a.admissionId === id).reduce((s, a) => s + a.amount, 0);
    setAdv(sum);
  };

  return (
    <PortalShell role="reception" title="Billing">
      <Card className="p-5 shadow-card mb-6">
        <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="space-y-1.5">
            <Label>Patient</Label>
            <Select value={admissionId} onValueChange={handleSelect}>
              <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
              <SelectContent>
                {admissions.map(a => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.patient} — {a.id} ({a.ward} · {a.bed})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selected && (
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">Doctor: {selected.doctor}</Badge>
              <Badge variant="secondary">Admitted: {selected.date}</Badge>
              <Badge>Advance Collected: {currency(collectedAdvance)}</Badge>
            </div>
          )}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 shadow-card lg:col-span-2">
          <h2 className="font-semibold">Bill Items {selected && <span className="text-sm font-normal text-muted-foreground">— {selected.patient}</span>}</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Field label="Ward Charges" v={w} onChange={setW} />
            <Field label="Doctor Charges" v={d} onChange={setD} />
            <Field label="Medicine" v={m} onChange={setM} />
            <Field label="Other" v={o} onChange={setO} />
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Payment</h3>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field label="Advance Paid" v={adv} onChange={setAdv} />
              <div className="space-y-1.5">
                <Label>Balance Amount</Label>
                <Input value={currency(balance)} readOnly className="font-semibold" />
              </div>
            </div>
            <Label className="mt-4 block">Payment Mode</Label>
            <RadioGroup defaultValue="cash" className="flex gap-4 mt-2">
              {["Cash", "UPI", "Card"].map(m => (
                <label key={m} className="flex items-center gap-2 text-sm">
                  <RadioGroupItem value={m.toLowerCase()} /> {m}
                </label>
              ))}
            </RadioGroup>
          </div>

          <Button className="mt-6 bg-gradient-primary" onClick={() => toast.success("Payment recorded")}>Record Payment</Button>
        </Card>

        <Card className="p-5 shadow-card h-fit">
          <h2 className="font-semibold">Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <Line k="Ward" v={w} />
            <Line k="Doctor" v={d} />
            <Line k="Medicine" v={m} />
            <Line k="Other" v={o} />
            <div className="border-t pt-2 mt-2">
              <Line k="Total" v={total} bold />
              <Line k="Advance" v={adv} />
              <Line k="Balance" v={balance} bold accent />
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}

function Field({ label, v, onChange }: { label: string; v: number; onChange: (n: number) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type="number" value={v} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </div>
  );
}
function Line({ k, v, bold, accent }: { k: string; v: number; bold?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
      <span className={accent ? "text-primary" : "text-muted-foreground"}>{k}</span>
      <span className={accent ? "text-primary" : ""}>{currency(v)}</span>
    </div>
  );
}
