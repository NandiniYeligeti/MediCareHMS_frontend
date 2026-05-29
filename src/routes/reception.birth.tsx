import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Baby, Printer, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/reception/birth")({
  component: BirthCertPage,
});

function BirthCertPage() {
  return (
    <PortalShell role="reception" title="Birth Certificate">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5 shadow-card">
          <div className="flex items-center gap-2 mb-1">
            <Baby className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">New Birth Certificate</h2>
          </div>
          <p className="text-xs text-muted-foreground">Visible only when case type is Delivery.</p>

          <form onSubmit={(e) => { e.preventDefault(); toast.success("Birth certificate saved"); }} className="mt-4 grid grid-cols-2 gap-3">
            <F label="Baby Name" />
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="m">Male</SelectItem><SelectItem value="f">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <F label="Date of Birth" type="date" />
            <F label="Time" type="time" />
            <F label="Weight (kg)" placeholder="3.2" />
            <F label="Mother Name" />
            <F label="Father Name" />
            <F label="Doctor Name" />
            <div className="col-span-2 flex gap-2 pt-2">
              <Button type="submit" className="bg-gradient-primary"><Save className="h-4 w-4 mr-1" />Save</Button>
              <Button type="button" variant="outline" onClick={() => toast.success("Certificate sent to printer")}><Printer className="h-4 w-4 mr-1" />Print Certificate</Button>
            </div>
          </form>
        </Card>

        <Card className="p-8 shadow-elegant bg-gradient-to-br from-primary/5 to-primary-glow/5 border-2 border-primary/20">
          <div className="text-center border-b-2 border-primary/30 pb-4">
            <p className="text-xs uppercase tracking-widest text-primary">MediCare Hospital</p>
            <h3 className="text-2xl font-bold mt-2">Birth Certificate</h3>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <p>This is to certify that a baby was born at MediCare Hospital with the following details:</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Field label="Baby Name" v="—" />
              <Field label="Gender" v="—" />
              <Field label="DOB" v="—" />
              <Field label="Weight" v="—" />
              <Field label="Mother" v="—" />
              <Field label="Father" v="—" />
            </div>
            <div className="pt-8 flex justify-between text-xs text-muted-foreground">
              <span>Issued: {new Date().toLocaleDateString("en-IN")}</span>
              <span className="border-t pt-1 px-4">Authorized Signatory</span>
            </div>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}

function F({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <div className="space-y-1.5"><Label>{label}</Label><Input {...p} /></div>;
}
function Field({ label, v }: { label: string; v: string }) {
  return <div><p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p><p className="font-medium">{v}</p></div>;
}
