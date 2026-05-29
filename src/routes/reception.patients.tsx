import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { patients, patientHistories, currency } from "@/lib/mock-data";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Eye, Search, Calendar, BedDouble, Wallet, Phone, MapPin, Droplet, User, Printer } from "lucide-react";

export const Route = createFileRoute("/reception/patients")({
  component: PatientsPage,
});

function PatientsPage() {
  const [saved, setSaved] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.mobile.includes(q));
  }, [query]);

  const selected = openId ? patients.find(p => p.id === openId) : null;
  const history = openId ? patientHistories[openId] : null;

  return (
    <PortalShell role="reception" title="Patient Registration & History">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 shadow-card lg:col-span-1">
          <h2 className="font-semibold">Add Patient</h2>
          <p className="text-xs text-muted-foreground">Auto-generates Patient ID on save</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const id = "PT-" + String(Math.floor(Math.random() * 900000) + 100000);
              setSaved(id);
              toast.success(`Patient registered: ${id}`);
            }}
            className="mt-4 space-y-3"
          >
            <Field label="Patient Name" placeholder="Full name" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                    <SelectItem value="o">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="DOB" type="date" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Age" placeholder="Auto" />
              <Field label="Mobile" placeholder="9876543210" />
            </div>
            <Field label="Address" placeholder="Street, City" />
            <div className="space-y-1.5">
              <Label>Blood Group</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="bg-gradient-primary flex-1">Save</Button>
              <Button type="reset" variant="outline">Clear</Button>
            </div>
            {saved && (
              <div className="rounded-md border border-success/40 bg-success/10 p-3 text-sm">
                <p className="font-medium text-success">Patient ID generated</p>
                <p className="font-mono text-base mt-1">{saved}</p>
              </div>
            )}
          </form>
        </Card>

        <Card className="p-5 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="font-semibold">Patient Records</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, mobile..."
                className="pl-8 w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender / Age</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const h = patientHistories[p.id];
                  const visits = h?.appointments.length ?? 0;
                  const admits = h?.admissions.length ?? 0;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.id}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.gender}, {p.age}</TableCell>
                      <TableCell>{p.mobile}</TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <Badge variant="secondary">{visits} OPD</Badge>
                          {admits > 0 && <Badge className="bg-accent text-accent-foreground">{admits} Adm</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setOpenId(p.id)}>
                          <Eye className="h-4 w-4 mr-1" />History
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No patients found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {selected.name}
                  <span className="font-mono text-xs text-muted-foreground ml-2">{selected.id}</span>
                </DialogTitle>
                <DialogDescription>Complete medical & billing history</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <InfoTile icon={<User className="h-4 w-4" />} label="Gender / Age" value={`${selected.gender}, ${selected.age}`} />
                <InfoTile icon={<Phone className="h-4 w-4" />} label="Mobile" value={selected.mobile} />
                <InfoTile icon={<Droplet className="h-4 w-4" />} label="Blood" value={selected.blood} />
                <InfoTile icon={<MapPin className="h-4 w-4" />} label="Address" value={selected.address} />
              </div>

              <SummaryStrip history={history} />

              <Tabs defaultValue="appointments" className="mt-2">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="appointments"><Calendar className="h-4 w-4 mr-1.5" />Appointments</TabsTrigger>
                  <TabsTrigger value="admissions"><BedDouble className="h-4 w-4 mr-1.5" />Admissions</TabsTrigger>
                  <TabsTrigger value="payments"><Wallet className="h-4 w-4 mr-1.5" />Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments">
                  {history?.appointments.length ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Fee</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.appointments.map((a, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-mono text-xs">{a.date}</TableCell>
                              <TableCell className="font-medium">{a.doctor}</TableCell>
                              <TableCell>{a.department}</TableCell>
                              <TableCell><Badge variant="outline">{a.type}</Badge></TableCell>
                              <TableCell className="text-right">{currency(a.fee)}</TableCell>
                              <TableCell>
                                <Badge className={
                                  a.status === "Completed" ? "bg-success text-success-foreground" :
                                  a.status === "Missed" ? "bg-destructive text-destructive-foreground" :
                                  "bg-accent text-accent-foreground"
                                }>{a.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : <Empty label="No appointments yet" />}
                </TabsContent>

                <TabsContent value="admissions">
                  {history?.admissions.length ? (
                    <div className="space-y-3">
                      {history.admissions.map((a) => (
                        <Card key={a.id} className="p-4">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <p className="font-semibold flex items-center gap-2">
                                {a.id}
                                <Badge className={a.status === "Discharged" ? "bg-success text-success-foreground" : "bg-accent text-accent-foreground"}>
                                  {a.status}
                                </Badge>
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {a.admittedOn} → {a.dischargedOn ?? "Ongoing"} • {a.days} days • {a.ward} ({a.bed})
                              </p>
                              <p className="text-xs text-muted-foreground">Under: {a.doctor}</p>
                            </div>
                            <Button size="sm" variant="outline"><Printer className="h-3.5 w-3.5 mr-1" />Bill</Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                            <Money label="Ward" value={a.wardCharges} />
                            <Money label="Doctor" value={a.doctorCharges} />
                            <Money label="Medicines" value={a.medicines} />
                            <Money label="Tests" value={a.tests} />
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-sm">
                            <Money label="Total" value={a.wardCharges + a.doctorCharges + a.medicines + a.tests} bold />
                            <Money label="Paid" value={a.paid} className="text-success" />
                            <Money label="Balance" value={a.balance} className={a.balance > 0 ? "text-destructive" : "text-success"} bold />
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : <Empty label="No admission records" />}
                </TabsContent>

                <TabsContent value="payments">
                  {history?.payments.length ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Mode</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.payments.map((p, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-mono text-xs">{p.date}</TableCell>
                              <TableCell>{p.purpose}</TableCell>
                              <TableCell><Badge variant="outline">{p.mode}</Badge></TableCell>
                              <TableCell className="font-mono text-xs">{p.ref}</TableCell>
                              <TableCell className="text-right font-medium">{currency(p.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="flex justify-end p-3 bg-muted/50 border-t text-sm">
                        <span className="font-semibold">Total Collected: {currency(history.payments.reduce((s, p) => s + p.amount, 0))}</span>
                      </div>
                    </div>
                  ) : <Empty label="No payment history" />}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PortalShell>
  );
}

function SummaryStrip({ history }: { history: { appointments: any[]; admissions: any[]; payments: any[] } | null }) {
  const totalAppts = history?.appointments.length ?? 0;
  const totalAdm = history?.admissions.length ?? 0;
  const totalPaid = history?.payments.reduce((s, p) => s + p.amount, 0) ?? 0;
  const outstanding = history?.admissions.reduce((s, a) => s + a.balance, 0) ?? 0;
  const lastVisit = history?.appointments[0]?.date ?? "—";
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 rounded-lg bg-gradient-subtle border">
      <Stat label="Total Appointments" value={String(totalAppts)} />
      <Stat label="Admissions" value={String(totalAdm)} />
      <Stat label="Total Paid" value={currency(totalPaid)} />
      <Stat label="Outstanding" value={currency(outstanding)} tone={outstanding > 0 ? "destructive" : "success"} />
      <Stat label="Last Visit" value={lastVisit} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "destructive" | "success" }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-base font-semibold ${tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border p-2.5">
      <p className="text-[11px] uppercase text-muted-foreground flex items-center gap-1.5">{icon}{label}</p>
      <p className="font-medium mt-0.5 truncate">{value}</p>
    </div>
  );
}

function Money({ label, value, className = "", bold = false }: { label: string; value: number; className?: string; bold?: boolean }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-muted-foreground">{label}</p>
      <p className={`${bold ? "font-bold" : "font-medium"} ${className}`}>{currency(value)}</p>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-center text-muted-foreground py-10 border rounded-md">{label}</div>;
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input {...p} />
    </div>
  );
}
