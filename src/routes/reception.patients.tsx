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
      <div className="max-w-7xl mx-auto pb-10 grid lg:grid-cols-3 gap-6">
        <Card className="p-6 shadow-card border-border lg:col-span-1 h-fit">
          <div className="mb-5">
            <h2 className="text-lg font-extrabold text-foreground">Add Patient</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">Auto-generates Patient ID on save</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const id = "PT-" + String(Math.floor(Math.random() * 900000) + 100000);
              setSaved(id);
              toast.success(`Patient registered: ${id}`);
            }}
            className="space-y-4"
          >
            <Field label="Patient Name" placeholder="Full name" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-semibold text-foreground">Gender</Label>
                <Select><SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">Male</SelectItem>
                    <SelectItem value="f">Female</SelectItem>
                    <SelectItem value="o">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="DOB" type="date" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Age" placeholder="Auto" />
              <Field label="Mobile" placeholder="9876543210" />
            </div>
            <Field label="Address" placeholder="Street, City" />
            <div className="space-y-1.5">
              <Label className="font-semibold text-foreground">Blood Group</Label>
              <Select><SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1 shadow-sm font-bold">Save</Button>
              <Button type="reset" variant="outline" className="border-border text-muted-foreground hover:bg-muted/50 font-bold">Clear</Button>
            </div>
            {saved && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 mt-4">
                <p className="text-sm font-bold text-green-700">Patient ID generated</p>
                <p className="font-mono text-xl font-extrabold text-green-900 mt-1">{saved}</p>
              </div>
            )}
          </form>
        </Card>

        <Card className="p-6 shadow-card border-border lg:col-span-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Patient Records</h2>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, mobile..."
                className="pl-9 w-full sm:w-72 bg-muted/50 border-border"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-xl border border-border overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-muted-foreground">ID</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Gender / Age</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Mobile</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Visits</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const h = patientHistories[p.id];
                  const visits = h?.appointments.length ?? 0;
                  const admits = h?.admissions.length ?? 0;
                  return (
                    <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono text-xs text-muted-foreground font-medium">{p.id}</TableCell>
                      <TableCell className="font-bold text-foreground">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.gender}, {p.age}</TableCell>
                      <TableCell className="text-muted-foreground">{p.mobile}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="bg-muted text-foreground hover:bg-slate-200">{visits} OPD</Badge>
                          {admits > 0 && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">{admits} Adm</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="border-border text-blue-600 hover:bg-blue-50 font-semibold" onClick={() => setOpenId(p.id)}>
                          <Eye className="h-4 w-4 mr-1.5" />History
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-10 font-medium">No patients found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-2xl">
          {selected && (
            <>
              <div className="p-6 border-b border-border bg-muted/50 rounded-t-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl font-extrabold text-foreground">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <User className="h-5 w-5" />
                    </div>
                    {selected.name}
                    <span className="font-mono text-sm font-medium text-muted-foreground ml-2 bg-background px-2 py-1 rounded-md border border-border">{selected.id}</span>
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground font-medium ml-12">Complete medical & billing history</DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 bg-background rounded-b-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <InfoTile icon={<User className="h-4 w-4" />} label="Gender / Age" value={`${selected.gender}, ${selected.age}`} />
                  <InfoTile icon={<Phone className="h-4 w-4" />} label="Mobile" value={selected.mobile} />
                  <InfoTile icon={<Droplet className="h-4 w-4" />} label="Blood" value={selected.blood} />
                  <InfoTile icon={<MapPin className="h-4 w-4" />} label="Address" value={selected.address} />
                </div>

                <SummaryStrip history={history} />

                <Tabs defaultValue="appointments" className="mt-4">
                  <TabsList className="grid grid-cols-3 w-full bg-muted p-1 rounded-xl">
                    <TabsTrigger value="appointments" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold"><Calendar className="h-4 w-4 mr-2" />Appointments</TabsTrigger>
                    <TabsTrigger value="admissions" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold"><BedDouble className="h-4 w-4 mr-2" />Admissions</TabsTrigger>
                    <TabsTrigger value="payments" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold"><Wallet className="h-4 w-4 mr-2" />Payments</TabsTrigger>
                  </TabsList>

                  <div className="mt-4">
                    <TabsContent value="appointments" className="m-0 focus-visible:outline-none">
                      {history?.appointments.length ? (
                        <div className="rounded-xl border border-border overflow-hidden">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead className="font-semibold text-muted-foreground">Date</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Doctor</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Department</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Type</TableHead>
                                <TableHead className="text-right font-semibold text-muted-foreground">Fee</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {history.appointments.map((a, i) => (
                                <TableRow key={i} className="hover:bg-muted/30">
                                  <TableCell className="font-mono text-xs text-muted-foreground">{a.date}</TableCell>
                                  <TableCell className="font-bold text-foreground">{a.doctor}</TableCell>
                                  <TableCell className="text-muted-foreground">{a.department}</TableCell>
                                  <TableCell><Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">{a.type}</Badge></TableCell>
                                  <TableCell className="text-right font-semibold text-foreground">{currency(a.fee)}</TableCell>
                                  <TableCell>
                                    <Badge className={
                                      a.status === "Completed" ? "bg-green-100 text-green-700 hover:bg-green-200 border-0" :
                                      a.status === "Missed" ? "bg-red-100 text-red-700 hover:bg-red-200 border-0" :
                                      "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"
                                    }>{a.status}</Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : <Empty label="No appointments yet" />}
                    </TabsContent>

                    <TabsContent value="admissions" className="m-0 focus-visible:outline-none">
                      {history?.admissions.length ? (
                        <div className="space-y-4">
                          {history.admissions.map((a) => (
                            <Card key={a.id} className="p-5 border-border shadow-sm rounded-xl overflow-hidden relative">
                              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                              <div className="flex items-start justify-between flex-wrap gap-2 pl-3">
                                <div>
                                  <p className="font-extrabold text-foreground flex items-center gap-3 text-base">
                                    {a.id}
                                    <Badge className={a.status === "Discharged" ? "bg-green-100 text-green-700 hover:bg-green-200 border-0" : "bg-blue-100 text-blue-700 hover:bg-blue-200 border-0"}>
                                      {a.status}
                                    </Badge>
                                  </p>
                                  <p className="text-sm font-medium text-muted-foreground mt-1.5">
                                    {a.admittedOn} → {a.dischargedOn ?? "Ongoing"} • {a.days} days • <span className="text-foreground">{a.ward} ({a.bed})</span>
                                  </p>
                                  <p className="text-sm font-medium text-muted-foreground mt-0.5">Under: <span className="text-foreground">{a.doctor}</span></p>
                                </div>
                                <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted/50 font-bold"><Printer className="h-4 w-4 mr-1.5 text-muted-foreground" />Bill</Button>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm bg-muted/50 p-4 rounded-lg ml-3">
                                <Money label="Ward" value={a.wardCharges} />
                                <Money label="Doctor" value={a.doctorCharges} />
                                <Money label="Medicines" value={a.medicines} />
                                <Money label="Tests" value={a.tests} />
                              </div>
                              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border text-sm ml-3">
                                <Money label="Total" value={a.wardCharges + a.doctorCharges + a.medicines + a.tests} bold className="text-foreground text-base" />
                                <Money label="Paid" value={a.paid} className="text-green-600 text-base" bold />
                                <Money label="Balance" value={a.balance} className={a.balance > 0 ? "text-red-600 text-base" : "text-green-600 text-base"} bold />
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : <Empty label="No admission records" />}
                    </TabsContent>

                    <TabsContent value="payments" className="m-0 focus-visible:outline-none">
                      {history?.payments.length ? (
                        <div className="rounded-xl border border-border overflow-hidden">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead className="font-semibold text-muted-foreground">Date</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Purpose</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Mode</TableHead>
                                <TableHead className="font-semibold text-muted-foreground">Reference</TableHead>
                                <TableHead className="text-right font-semibold text-muted-foreground">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {history.payments.map((p, i) => (
                                <TableRow key={i} className="hover:bg-muted/30">
                                  <TableCell className="font-mono text-xs text-muted-foreground">{p.date}</TableCell>
                                  <TableCell className="font-medium text-foreground">{p.purpose}</TableCell>
                                  <TableCell><Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">{p.mode}</Badge></TableCell>
                                  <TableCell className="font-mono text-xs text-muted-foreground">{p.ref}</TableCell>
                                  <TableCell className="text-right font-bold text-foreground">{currency(p.amount)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <div className="flex justify-end p-4 bg-muted/50 border-t border-border text-sm">
                            <span className="font-extrabold text-foreground text-base">Total Collected: <span className="text-green-600">{currency(history.payments.reduce((s, p) => s + p.amount, 0))}</span></span>
                          </div>
                        </div>
                      ) : <Empty label="No payment history" />}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
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
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-inner">
      <Stat label="Appointments" value={String(totalAppts)} />
      <Stat label="Admissions" value={String(totalAdm)} />
      <Stat label="Total Paid" value={currency(totalPaid)} tone="success" />
      <Stat label="Outstanding" value={currency(outstanding)} tone={outstanding > 0 ? "destructive" : "success"} />
      <Stat label="Last Visit" value={lastVisit} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "destructive" | "success" }) {
  return (
    <div className="bg-background/60 p-3 rounded-lg border border-white/50 backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={`text-lg font-extrabold ${tone === "destructive" ? "text-red-600" : tone === "success" ? "text-green-600" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3.5 bg-muted/30 flex flex-col justify-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-1.5">
        <span className="text-blue-500">{icon}</span>
        {label}
      </p>
      <p className="font-bold text-foreground truncate text-sm">{value}</p>
    </div>
  );
}

function Money({ label, value, className = "", bold = false }: { label: string; value: number; className?: string; bold?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={`${bold ? "font-extrabold" : "font-bold"} text-foreground ${className}`}>{currency(value)}</p>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="text-center text-muted-foreground py-12 border border-border border-dashed rounded-xl bg-muted/30 font-medium">{label}</div>;
}

function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label className="font-semibold text-foreground">{label}</Label>
      <Input {...p} className="bg-muted/50 border-border focus-visible:ring-blue-500" />
    </div>
  );
}
