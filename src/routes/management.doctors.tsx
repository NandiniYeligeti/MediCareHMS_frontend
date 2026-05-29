import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { StatusPill } from "@/components/StatCard";
import { doctors, currency } from "@/lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/management/doctors")({
  component: DoctorsPage,
});

function DoctorsPage() {
  return (
    <PortalShell role="management" title="Doctors">
      <Card className="p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Doctor Directory</h2>
            <p className="text-sm text-muted-foreground">Manage practitioners, specializations and OPD fees</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary"><Plus className="h-4 w-4 mr-1" /> Add Doctor</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Doctor</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                {[
                  ["Doctor Name", "Dr. Full Name"],
                  ["Specialization", "e.g. Cardiology"],
                  ["Qualification", "MBBS, MD"],
                  ["Mobile", "9876543210"],
                  ["OPD Fees", "500"],
                  ["Available Days", "Mon, Wed, Fri"],
                  ["Time Slot", "10:00 AM – 2:00 PM"],
                ].map(([l, p]) => (
                  <div key={l} className="grid gap-1.5">
                    <Label>{l}</Label>
                    <Input placeholder={p} />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button className="bg-gradient-primary">Save Doctor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>OPD Fees</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.specialization}</TableCell>
                  <TableCell>{currency(d.fees)}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell><StatusPill status={d.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PortalShell>
  );
}
