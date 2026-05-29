import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/PortalShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/management/staff")({
  component: StaffPage,
});

export type StaffRole =
  | "Nurse"
  | "Ward Boy"
  | "Receptionist"
  | "Pharmacist"
  | "Lab Technician"
  | "Radiologist"
  | "Accountant"
  | "Housekeeping"
  | "Security"
  | "Administrator"
  | "Other";

const ROLES: StaffRole[] = [
  "Nurse",
  "Ward Boy",
  "Receptionist",
  "Pharmacist",
  "Lab Technician",
  "Radiologist",
  "Accountant",
  "Housekeeping",
  "Security",
  "Administrator",
  "Other",
];

const SHIFTS = ["Morning", "Evening", "Night", "General"] as const;
const STATUSES = ["Active", "On Leave", "Inactive"] as const;

export type Staff = {
  id: string;
  fullName: string;
  role: StaffRole;
  department: string;
  gender: "Male" | "Female" | "Other";
  dob: string;
  mobile: string;
  email: string;
  address: string;
  qualification: string;
  experience: string;
  joiningDate: string;
  shift: (typeof SHIFTS)[number];
  salary: string;
  emergencyContact: string;
  bloodGroup: string;
  idProof: string;
  status: (typeof STATUSES)[number];
  notes: string;
};

const STORAGE_KEY = "hms.staff";

export const DEFAULT_STAFF: Staff[] = [
  {
    id: "STF100001",
    fullName: "Rajesh Kumar Sharma",
    role: "Nurse",
    department: "ICU",
    gender: "Male",
    dob: "1988-04-15",
    mobile: "9876543210",
    email: "rajesh.sharma@hospital.com",
    address: "45, Green Park Colony, New Delhi",
    qualification: "B.Sc Nursing, GNM",
    experience: "8",
    joiningDate: "2017-06-01",
    shift: "Morning",
    salary: "45000",
    emergencyContact: "9876543211",
    bloodGroup: "O+",
    idProof: "Aadhaar: 1234-5678-9012",
    status: "Active",
    notes: "Senior ICU nurse, excellent patient handling skills.",
  },
  {
    id: "STF100002",
    fullName: "Priya Menon",
    role: "Receptionist",
    department: "OPD",
    gender: "Female",
    dob: "1995-09-22",
    mobile: "8765432109",
    email: "priya.menon@hospital.com",
    address: "12, Lake View Apartments, Bangalore",
    qualification: "B.Com, Diploma in Hospital Administration",
    experience: "4",
    joiningDate: "2020-03-15",
    shift: "General",
    salary: "32000",
    emergencyContact: "8765432108",
    bloodGroup: "B+",
    idProof: "Aadhaar: 2345-6789-0123",
    status: "Active",
    notes: "Handles front desk and patient enquiries efficiently.",
  },
  {
    id: "STF100003",
    fullName: "Suresh Babu Nair",
    role: "Lab Technician",
    department: "Pathology",
    gender: "Male",
    dob: "1990-12-05",
    mobile: "7654321098",
    email: "suresh.nair@hospital.com",
    address: "78, Beach Road, Kochi, Kerala",
    qualification: "DMLT, B.Sc MLT",
    experience: "6",
    joiningDate: "2018-08-10",
    shift: "Morning",
    salary: "38000",
    emergencyContact: "7654321097",
    bloodGroup: "A+",
    idProof: "PAN: ABCDE1234F",
    status: "Active",
    notes: "Specialized in biochemistry and hematology tests.",
  },
  {
    id: "STF100004",
    fullName: "Anita Devi",
    role: "Pharmacist",
    department: "Pharmacy",
    gender: "Female",
    dob: "1992-03-18",
    mobile: "6543210987",
    email: "anita.devi@hospital.com",
    address: "33, Patel Nagar, Mumbai",
    qualification: "B.Pharm, D.Pharm",
    experience: "5",
    joiningDate: "2019-05-20",
    shift: "Evening",
    salary: "40000",
    emergencyContact: "6543210986",
    bloodGroup: "AB+",
    idProof: "Aadhaar: 3456-7890-1234",
    status: "Active",
    notes: "Responsible for inpatient and outpatient medicine dispensing.",
  },
  {
    id: "STF100005",
    fullName: "Mohammad Irfan Khan",
    role: "Security",
    department: "Security",
    gender: "Male",
    dob: "1985-07-30",
    mobile: "5432109876",
    email: "irfan.khan@hospital.com",
    address: "56, Civil Lines, Hyderabad",
    qualification: "12th Pass, Security Training Certificate",
    experience: "10",
    joiningDate: "2015-01-12",
    shift: "Night",
    salary: "28000",
    emergencyContact: "5432109875",
    bloodGroup: "O-",
    idProof: "Aadhaar: 4567-8901-2345",
    status: "Active",
    notes: "Night shift supervisor, ensures hospital premises safety.",
  },
  {
    id: "STF100006",
    fullName: "Lakshmi Narayanan",
    role: "Housekeeping",
    department: "Housekeeping",
    gender: "Female",
    dob: "1978-11-10",
    mobile: "4321098765",
    email: "lakshmi.n@hospital.com",
    address: "89, Temple Street, Chennai",
    qualification: "10th Pass",
    experience: "12",
    joiningDate: "2013-04-01",
    shift: "Morning",
    salary: "22000",
    emergencyContact: "4321098764",
    bloodGroup: "A-",
    idProof: "Aadhaar: 5678-9012-3456",
    status: "Active",
    notes: "Senior housekeeping staff, maintains ICU and ward hygiene.",
  },
];

export function loadStaff(): Staff[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [...DEFAULT_STAFF];
}
export function saveStaff(list: Staff[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const empty: Staff = {
  id: "",
  fullName: "",
  role: "Nurse",
  department: "",
  gender: "Male",
  dob: "",
  mobile: "",
  email: "",
  address: "",
  qualification: "",
  experience: "",
  joiningDate: new Date().toISOString().slice(0, 10),
  shift: "General",
  salary: "",
  emergencyContact: "",
  bloodGroup: "",
  idProof: "",
  status: "Active",
  notes: "",
};

export function StaffPage() {
  const { session } = useAuth();
  const role = (session?.role === "reception" ? "reception" : "management") as "management" | "reception";
  const readOnly = role === "reception";

  const [list, setList] = useState<Staff[]>([]);
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("All");
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [form, setForm] = useState<Staff>(empty);
  const [viewing, setViewing] = useState<Staff | null>(null);

  useEffect(() => {
    setList(loadStaff());
  }, []);

  const filtered = useMemo(() => {
    return list.filter((s) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.mobile.includes(q) ||
        s.department.toLowerCase().includes(q);
      const matchR = filterRole === "All" || s.role === filterRole;
      return matchQ && matchR;
    });
  }, [list, query, filterRole]);

  const persist = (next: Staff[]) => {
    setList(next);
    saveStaff(next);
  };

  const openAdd = () => {
    setForm({ ...empty, id: "STF" + Date.now().toString().slice(-6) });
    setOpen(true);
  };
  const openEdit = (s: Staff) => {
    setForm(s);
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.fullName.trim() || !form.mobile.trim()) {
      toast.error("Name and Mobile are required");
      return;
    }
    const exists = list.some((s) => s.id === form.id);
    const next = exists ? list.map((s) => (s.id === form.id ? form : s)) : [form, ...list];
    persist(next);
    setOpen(false);
    toast.success(exists ? "Staff updated" : "Staff added");
  };
  const handleDelete = (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    persist(list.filter((s) => s.id !== id));
    toast.success("Deleted");
  };

  const upd = <K extends keyof Staff>(k: K, v: Staff[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <PortalShell role={role} title={readOnly ? "Staff Directory" : "Staff Management"}>
      <Card className="p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Hospital Staff</h2>
            <p className="text-sm text-muted-foreground">
              {readOnly ? "View staff details and contact information" : "Manage all non-doctor staff with roles and details"}
            </p>
          </div>
          {!readOnly && (
            <Button className="bg-gradient-primary" onClick={openAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Staff
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="h-4 w-4 absolute left-2 top-2.5 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search name, ID, mobile, department" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No staff records</TableCell></TableRow>
              ) : filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.fullName}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.department || "-"}</TableCell>
                  <TableCell>{s.mobile}</TableCell>
                  <TableCell>{s.shift}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Active" ? "default" : s.status === "On Leave" ? "secondary" : "outline"}>{s.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setViewing(s); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                    {!readOnly && (
                      <>
                        <Button size="icon" variant="ghost" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{list.some(s => s.id === form.id) ? "Edit Staff" : "Add Staff"}</DialogTitle></DialogHeader>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Staff ID"><Input value={form.id} disabled /></Field>
            <Field label="Full Name *"><Input value={form.fullName} onChange={(e) => upd("fullName", e.target.value)} /></Field>
            <Field label="Role *">
              <Select value={form.role} onValueChange={(v) => upd("role", v as StaffRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Department"><Input placeholder="e.g. ICU, OPD" value={form.department} onChange={(e) => upd("department", e.target.value)} /></Field>
            <Field label="Gender">
              <Select value={form.gender} onValueChange={(v) => upd("gender", v as Staff["gender"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Date of Birth"><Input type="date" value={form.dob} onChange={(e) => upd("dob", e.target.value)} /></Field>
            <Field label="Mobile *"><Input value={form.mobile} onChange={(e) => upd("mobile", e.target.value)} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => upd("email", e.target.value)} /></Field>
            <Field label="Qualification"><Input value={form.qualification} onChange={(e) => upd("qualification", e.target.value)} /></Field>
            <Field label="Experience (years)"><Input value={form.experience} onChange={(e) => upd("experience", e.target.value)} /></Field>
            <Field label="Joining Date"><Input type="date" value={form.joiningDate} onChange={(e) => upd("joiningDate", e.target.value)} /></Field>
            <Field label="Shift">
              <Select value={form.shift} onValueChange={(v) => upd("shift", v as Staff["shift"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SHIFTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Salary"><Input value={form.salary} onChange={(e) => upd("salary", e.target.value)} /></Field>
            <Field label="Emergency Contact"><Input value={form.emergencyContact} onChange={(e) => upd("emergencyContact", e.target.value)} /></Field>
            <Field label="Blood Group"><Input placeholder="O+" value={form.bloodGroup} onChange={(e) => upd("bloodGroup", e.target.value)} /></Field>
            <Field label="ID Proof (Aadhaar/PAN)"><Input value={form.idProof} onChange={(e) => upd("idProof", e.target.value)} /></Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => upd("status", v as Staff["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Address"><Textarea rows={2} value={form.address} onChange={(e) => upd("address", e.target.value)} /></Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Notes"><Textarea rows={2} value={form.notes} onChange={(e) => upd("notes", e.target.value)} /></Field>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-gradient-primary" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Staff Details</DialogTitle></DialogHeader>
          {viewing && (
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Row k="Staff ID" v={viewing.id} />
              <Row k="Name" v={viewing.fullName} />
              <Row k="Role" v={viewing.role} />
              <Row k="Department" v={viewing.department} />
              <Row k="Gender" v={viewing.gender} />
              <Row k="DOB" v={viewing.dob} />
              <Row k="Mobile" v={viewing.mobile} />
              <Row k="Email" v={viewing.email} />
              <Row k="Qualification" v={viewing.qualification} />
              <Row k="Experience" v={viewing.experience} />
              <Row k="Joining Date" v={viewing.joiningDate} />
              <Row k="Shift" v={viewing.shift} />
              <Row k="Salary" v={viewing.salary} />
              <Row k="Emergency Contact" v={viewing.emergencyContact} />
              <Row k="Blood Group" v={viewing.bloodGroup} />
              <Row k="ID Proof" v={viewing.idProof} />
              <Row k="Status" v={viewing.status} />
              <div className="sm:col-span-2"><Row k="Address" v={viewing.address} /></div>
              <div className="sm:col-span-2"><Row k="Notes" v={viewing.notes} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b py-1">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right break-all">{v || "-"}</span>
    </div>
  );
}
