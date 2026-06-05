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
import { Plus, Pencil, Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/management/doctors")({
  component: DoctorsPage,
});

function DoctorsPage() {
  return (
    <PortalShell role="management" title="Doctors">
      <div className="max-w-7xl mx-auto pb-10 space-y-6">
        <Card className="p-6 shadow-card border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">Doctor Directory</h2>
              <p className="text-sm font-medium text-muted-foreground mt-1">Manage practitioners, specializations and OPD fees</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search doctors..." className="pl-9 bg-muted/50 border-border" />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"><Plus className="h-4 w-4 mr-1.5" /> Add Doctor</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Doctor</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-2">
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
                        <Label className="font-semibold text-foreground">{l}</Label>
                        <Input placeholder={p} className="bg-muted/50" />
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">Save Doctor</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden bg-background">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold text-muted-foreground">ID</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Specialization</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">OPD Fees</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Phone</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right font-semibold text-muted-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((d) => (
                  <TableRow key={d.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs text-muted-foreground font-medium">{d.id}</TableCell>
                    <TableCell className="font-bold text-foreground">{d.name}</TableCell>
                    <TableCell className="font-medium text-muted-foreground">{d.specialization}</TableCell>
                    <TableCell className="font-semibold text-foreground">{currency(d.fees)}</TableCell>
                    <TableCell className="text-muted-foreground">{d.phone}</TableCell>
                    <TableCell><StatusPill status={d.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
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
