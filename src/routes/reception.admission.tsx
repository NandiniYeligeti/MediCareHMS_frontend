import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { patients, doctors, wards, beds, admissions, currency } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/reception/admission")({
  component: AdmissionPage,
});

function AdmissionPage() {
  return (
    <PortalShell role="reception" title="Admission">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-5 shadow-card">
          <h2 className="font-semibold">Admit Patient</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); toast.success("Patient admitted. Bed marked Occupied."); }}
            className="mt-4 space-y-3"
          >
            <Pick label="Select Patient" opts={patients.map(p => p.name)} />
            <Pick label="Select Doctor" opts={doctors.map(d => d.name)} />
            <Pick label="Select Ward" opts={wards.map(w => w.name)} />
            <Pick label="Select Bed" opts={beds.filter(b => b.status === "available").map(b => b.id)} />
            <div className="space-y-1.5"><Label>Admission Date</Label><Input type="date" /></div>
            <div className="space-y-1.5"><Label>Advance Amount</Label><Input type="number" placeholder="5000" /></div>
            <Button type="submit" className="w-full bg-gradient-primary">Admit Patient</Button>
          </form>
        </Card>

        <Card className="p-5 shadow-card lg:col-span-2">
          <h2 className="font-semibold">Active Admissions</h2>
          <div className="mt-3 rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Advance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="font-medium">{a.patient}</TableCell>
                    <TableCell>{a.doctor}</TableCell>
                    <TableCell>{a.ward}</TableCell>
                    <TableCell>{a.bed}</TableCell>
                    <TableCell>{a.date}</TableCell>
                    <TableCell>{currency(a.advance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}

function Pick({ label, opts }: { label: string; opts: string[] }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select>
        <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
        <SelectContent>
          {opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
