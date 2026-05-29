import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { patients, doctors, formatSittingHours, buildDoctorSlots } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/reception/opd")({
  component: OpdPage,
});

function OpdPage() {
  const [step, setStep] = useState(1);
  const [token, setToken] = useState<number | null>(null);
  const [data, setData] = useState({ patient: "", doctor: "", date: "", slot: "" });

  const next = () => setStep((s) => s + 1);

  const generate = () => {
    const t = Math.floor(Math.random() * 30) + 1;
    setToken(t);
    toast.success(`Token ${t} generated`);
  };

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.name === data.doctor),
    [data.doctor],
  );
  const sittingLabel = selectedDoctor
    ? formatSittingHours(selectedDoctor.sittingFrom, selectedDoctor.sittingTo)
    : "";
  const slots = useMemo(
    () =>
      selectedDoctor
        ? buildDoctorSlots(selectedDoctor.sittingFrom, selectedDoctor.sittingTo, selectedDoctor.slotMinutes)
        : [],
    [selectedDoctor],
  );

  return (
    <PortalShell role="reception" title="OPD Appointment Booking">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 shadow-card lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            {[1,2,3,4,5].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${step >= n ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {n}
                </div>
                {n < 5 && <div className={`h-0.5 w-8 ${step > n ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Step title="1. Select Patient">
              <Select onValueChange={(v) => setData((d) => ({ ...d, patient: v }))}>
                <SelectTrigger><SelectValue placeholder="Choose patient" /></SelectTrigger>
                <SelectContent>{patients.map(p => <SelectItem key={p.id} value={p.name}>{p.name} ({p.id})</SelectItem>)}</SelectContent>
              </Select>
            </Step>
          )}
          {step === 2 && (
            <Step title="2. Select Doctor">
              <Select value={data.doctor} onValueChange={(v) => setData((d) => ({ ...d, doctor: v, slot: "" }))}>
                <SelectTrigger><SelectValue placeholder="Choose doctor" /></SelectTrigger>
                <SelectContent>
                  {doctors.map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name} — {d.specialization} ({formatSittingHours(d.sittingFrom, d.sittingTo)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDoctor && (
                <div className="mt-3 flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Sitting hours:</span>
                  <span className="font-medium">{sittingLabel}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Slot: {selectedDoctor.slotMinutes} min
                  </span>
                </div>
              )}
            </Step>
          )}
          {step === 3 && (
            <Step title="3. Select Date">
              <Input type="date" onChange={(e) => setData((d) => ({ ...d, date: e.target.value }))} />
            </Step>
          )}
          {step === 4 && (
            <Step title="4. Select Time Slot">
              {selectedDoctor ? (
                <>
                  <div className="mb-3 flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{selectedDoctor.name} sits</span>
                    <span className="font-medium">{sittingLabel}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {slots.length} slots × {selectedDoctor.slotMinutes} min
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((s) => (
                      <Button
                        key={s}
                        variant={data.slot === s ? "default" : "outline"}
                        onClick={() => setData((d) => ({ ...d, slot: s }))}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Please select a doctor first to see available slots.</p>
              )}
            </Step>
          )}
          {step === 5 && (
            <Step title="5. Generate Token">
              {!token ? (
                <Button onClick={generate} className="bg-gradient-primary">Generate Token</Button>
              ) : (
                <div className="rounded-lg border p-6 bg-success/5 text-center">
                  <CheckCircle2 className="h-10 w-10 text-success mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">Appointment Token</p>
                  <p className="text-5xl font-bold tracking-tight mt-1">#{token}</p>
                </div>
              )}
            </Step>
          )}

          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < 5 ? (
              <Button className="bg-gradient-primary" onClick={next}>Next</Button>
            ) : (
              <Button variant="outline" onClick={() => { setStep(1); setToken(null); setData({patient:"",doctor:"",date:"",slot:""}); }}>New Booking</Button>
            )}
          </div>
        </Card>

        <Card className="p-5 shadow-card">
          <h3 className="font-semibold">Appointment Card</h3>
          <div className="mt-4 rounded-lg border p-4 bg-gradient-to-br from-primary/5 to-primary-glow/5">
            <Row k="Token" v={token ? `#${token}` : "—"} />
            <Row k="Patient" v={data.patient || "—"} />
            <Row k="Doctor" v={data.doctor || "—"} />
            <Row k="Sitting Hours" v={sittingLabel || "—"} />
            <Row k="Date" v={data.date || "—"} />
            <Row k="Slot Time" v={data.slot || "—"} />
            <Row k="Status" v={token ? "Booked" : "Pending"} />
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-base font-semibold">{title}</Label>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm py-1.5 border-b last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
