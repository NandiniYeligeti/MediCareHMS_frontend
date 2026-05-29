import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { wards, currency } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/management/wards")({
  component: WardsPage,
});

function WardsPage() {
  return (
    <PortalShell role="management" title="Wards">
      <Card className="p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Ward Setup</h2>
            <p className="text-sm text-muted-foreground">Configure wards, capacity and per-day fee</p>
          </div>
          <Button className="bg-gradient-primary"><Plus className="h-4 w-4 mr-1" />Add Ward</Button>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total Beds</TableHead>
                <TableHead>Fee / Day</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wards.map((w) => (
                <TableRow key={w.name}>
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>{w.type}</TableCell>
                  <TableCell>{w.beds}</TableCell>
                  <TableCell>{currency(w.fee)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </PortalShell>
  );
}
