export const summary = {
  opdToday: 47,
  admissionsToday: 6,
  availableBeds: 12,
  dischargesToday: 4,
  revenueToday: 184500,
};

export const wardOccupancy = [
  { name: "Private Ward", used: 8, total: 10 },
  { name: "General Ward", used: 12, total: 20 },
  { name: "ICU", used: 3, total: 5 },
  { name: "Semi-Private", used: 4, total: 8 },
];

export const doctorActivity = [
  { name: "Dr. Amit Sharma", seen: 18, specialization: "General Physician" },
  { name: "Dr. Neha Verma", seen: 12, specialization: "Gynecology" },
  { name: "Dr. Rajesh Patel", seen: 9, specialization: "Pediatrics" },
  { name: "Dr. Priya Mehta", seen: 7, specialization: "Cardiology" },
];

export const doctors = [
  { id: "DOC-001", name: "Dr. Amit Sharma", specialization: "General Physician", fees: 500, phone: "9876543210", status: "Active", sittingFrom: "10:00", sittingTo: "14:00", slotMinutes: 15 },
  { id: "DOC-002", name: "Dr. Neha Verma", specialization: "Gynecology", fees: 700, phone: "9876543211", status: "Active", sittingFrom: "11:00", sittingTo: "15:00", slotMinutes: 15 },
  { id: "DOC-003", name: "Dr. Rajesh Patel", specialization: "Pediatrics", fees: 600, phone: "9876543212", status: "Active", sittingFrom: "09:30", sittingTo: "13:00", slotMinutes: 15 },
  { id: "DOC-004", name: "Dr. Priya Mehta", specialization: "Cardiology", fees: 1000, phone: "9876543213", status: "On Leave", sittingFrom: "17:00", sittingTo: "20:00", slotMinutes: 20 },
];

// Format "HH:MM" 24h -> "h:MM AM/PM"
export const formatTime12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
};

// Sitting window like "10:00 AM – 2:00 PM"
export const formatSittingHours = (from: string, to: string) =>
  `${formatTime12(from)} – ${formatTime12(to)}`;

// Generate appointment start slots within a doctor's sitting window
export const buildDoctorSlots = (from: string, to: string, stepMin = 15): string[] => {
  const [fh, fm] = from.split(":").map(Number);
  const [th, tm] = to.split(":").map(Number);
  const start = fh * 60 + fm;
  const end = th * 60 + tm;
  const out: string[] = [];
  for (let t = start; t + stepMin <= end; t += stepMin) {
    const hh = Math.floor(t / 60).toString().padStart(2, "0");
    const mm = (t % 60).toString().padStart(2, "0");
    out.push(formatTime12(`${hh}:${mm}`));
  }
  return out;
};

export const staff = [
  { id: "STF-001", name: "Anita Singh", role: "Reception", mobile: "9876500001", department: "Front Desk" },
  { id: "STF-002", name: "Pooja Rao", role: "Nurse", mobile: "9876500002", department: "ICU" },
  { id: "STF-003", name: "Ramesh Kumar", role: "Ward Boy", mobile: "9876500003", department: "General Ward" },
  { id: "STF-004", name: "Sunita Devi", role: "Nurse", mobile: "9876500004", department: "Maternity" },
];

export const wards = [
  { name: "Private Ward", type: "Private", beds: 10, fee: 2500 },
  { name: "General Ward", type: "General", beds: 20, fee: 800 },
  { name: "Semi-Private", type: "Semi-Private", beds: 8, fee: 1500 },
  { name: "ICU", type: "ICU", beds: 5, fee: 5000 },
  { name: "Maternity", type: "Reserved", beds: 6, fee: 2000 },
];

export type BedStatus = "available" | "occupied" | "reserved";
export const beds: { id: string; ward: string; status: BedStatus }[] = [
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `P-${101 + i}`,
    ward: "Private",
    status: (i < 8 ? "occupied" : i === 8 ? "reserved" : "available") as BedStatus,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `G-${201 + i}`,
    ward: "General",
    status: (i < 12 ? "occupied" : "available") as BedStatus,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `ICU-${301 + i}`,
    ward: "ICU",
    status: (i < 3 ? "occupied" : "available") as BedStatus,
  })),
];

export const patients = [
  { id: "PT-000234", name: "Ravi Kumar", gender: "Male", age: 34, mobile: "9988776655", blood: "B+", address: "12 MG Road" },
  { id: "PT-000235", name: "Sneha Iyer", gender: "Female", age: 28, mobile: "9988776656", blood: "O+", address: "44 Park Street" },
  { id: "PT-000236", name: "Mohit Jain", gender: "Male", age: 52, mobile: "9988776657", blood: "A-", address: "8 Lake View" },
  { id: "PT-000237", name: "Kavya Nair", gender: "Female", age: 6, mobile: "9988776658", blood: "AB+", address: "21 Hill Road" },
];

export type QueueStatus = "Waiting" | "In Consultation" | "Done" | "Missed" | "Scheduled" | "Cancelled";
export type QueueEntry = { token: number; patient: string; patientId: string; doctor: string; date: string; time: string; status: QueueStatus; mobile: string };
// Note: receptionQueue is populated below after `iso()` helper is defined.
export let queue: QueueEntry[] = [];
export const receptionQueue: QueueEntry[] = [];

export const admissions = [
  { id: "ADM-101", patient: "Mohit Jain", doctor: "Dr. Priya Mehta", ward: "Private", bed: "P-102", date: "2026-04-27", advance: 10000 },
  { id: "ADM-102", patient: "Asha Pillai", doctor: "Dr. Neha Verma", ward: "Maternity", bed: "M-401", date: "2026-04-29", advance: 5000 },
];

export type AdvanceReason = "Admission Advance" | "Blood / Transfusion" | "Lab / Diagnostic Test" | "Radiology (X-Ray/CT/MRI)" | "Medicine" | "Surgery / OT" | "ICU Charges" | "Other";
export type AdvanceMode = "Cash" | "UPI" | "Card" | "Insurance" | "Bank Transfer";
export type AdvanceEntry = {
  id: string;
  admissionId: string;
  patient: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  amount: number;
  reason: AdvanceReason;
  note?: string;
  mode: AdvanceMode;
  ref: string;
  collectedBy: string;
};

export const advanceLedger: AdvanceEntry[] = [
  { id: "ADV-1001", admissionId: "ADM-101", patient: "Mohit Jain", date: "2026-04-27", time: "10:15", amount: 10000, reason: "Admission Advance", mode: "Card", ref: "CARD-8890", collectedBy: "Anita Singh" },
  { id: "ADV-1002", admissionId: "ADM-101", patient: "Mohit Jain", date: "2026-04-28", time: "12:40", amount: 3500, reason: "Lab / Diagnostic Test", note: "CBC, LFT, KFT", mode: "UPI", ref: "TXN10021", collectedBy: "Anita Singh" },
  { id: "ADV-1003", admissionId: "ADM-101", patient: "Mohit Jain", date: "2026-04-29", time: "09:05", amount: 4500, reason: "Blood / Transfusion", note: "1 unit B+", mode: "Cash", ref: "RCT-712", collectedBy: "Anita Singh" },
  { id: "ADV-1004", admissionId: "ADM-101", patient: "Mohit Jain", date: "2026-04-30", time: "16:20", amount: 2800, reason: "Radiology (X-Ray/CT/MRI)", note: "Chest CT", mode: "UPI", ref: "TXN10044", collectedBy: "Anita Singh" },
  { id: "ADV-1005", admissionId: "ADM-102", patient: "Asha Pillai", date: "2026-04-29", time: "11:00", amount: 5000, reason: "Admission Advance", mode: "Cash", ref: "RCT-720", collectedBy: "Anita Singh" },
  { id: "ADV-1006", admissionId: "ADM-102", patient: "Asha Pillai", date: "2026-05-01", time: "14:30", amount: 1500, reason: "Medicine", note: "Top-up pharmacy", mode: "UPI", ref: "TXN10090", collectedBy: "Anita Singh" },
];

export const reports = [
  { type: "OPD Report", count: 312, period: "This Week" },
  { type: "Admissions", count: 28, period: "This Week" },
  { type: "Discharges", count: 19, period: "This Week" },
  { type: "Daily Collection", count: 184500, period: "Today", currency: true },
];

export const currency = (n: number) => "₹" + n.toLocaleString("en-IN");

export type PatientAppointment = { date: string; doctor: string; department: string; type: "OPD" | "Follow-up" | "Emergency"; fee: number; status: "Completed" | "Missed" | "Scheduled" };
export type PatientAdmission = { id: string; admittedOn: string; dischargedOn: string | null; ward: string; bed: string; doctor: string; days: number; wardCharges: number; doctorCharges: number; medicines: number; tests: number; advance: number; paid: number; balance: number; status: "Discharged" | "Admitted" };
export type PatientPayment = { date: string; mode: "Cash" | "UPI" | "Card" | "Insurance"; ref: string; purpose: string; amount: number };

export const patientHistories: Record<string, { appointments: PatientAppointment[]; admissions: PatientAdmission[]; payments: PatientPayment[] }> = {
  "PT-000234": {
    appointments: [
      { date: "2026-04-28", doctor: "Dr. Amit Sharma", department: "General Physician", type: "OPD", fee: 500, status: "Completed" },
      { date: "2026-03-15", doctor: "Dr. Amit Sharma", department: "General Physician", type: "Follow-up", fee: 300, status: "Completed" },
      { date: "2026-02-02", doctor: "Dr. Priya Mehta", department: "Cardiology", type: "OPD", fee: 1000, status: "Completed" },
      { date: "2025-12-10", doctor: "Dr. Amit Sharma", department: "General Physician", type: "OPD", fee: 500, status: "Missed" },
    ],
    admissions: [
      { id: "ADM-088", admittedOn: "2026-02-03", dischargedOn: "2026-02-08", ward: "Private", bed: "P-104", doctor: "Dr. Priya Mehta", days: 5, wardCharges: 12500, doctorCharges: 5000, medicines: 3200, tests: 4500, advance: 10000, paid: 25200, balance: 0, status: "Discharged" },
    ],
    payments: [
      { date: "2026-04-28", mode: "UPI", ref: "TXN9921", purpose: "OPD Consultation", amount: 500 },
      { date: "2026-03-15", mode: "Cash", ref: "RCT-441", purpose: "Follow-up", amount: 300 },
      { date: "2026-02-08", mode: "Card", ref: "CARD-7781", purpose: "Discharge Settlement", amount: 15200 },
      { date: "2026-02-03", mode: "UPI", ref: "TXN8810", purpose: "Admission Advance", amount: 10000 },
      { date: "2026-02-02", mode: "Cash", ref: "RCT-389", purpose: "Cardiology OPD", amount: 1000 },
    ],
  },
  "PT-000235": {
    appointments: [
      { date: "2026-04-29", doctor: "Dr. Neha Verma", department: "Gynecology", type: "OPD", fee: 700, status: "Completed" },
      { date: "2026-04-01", doctor: "Dr. Neha Verma", department: "Gynecology", type: "Follow-up", fee: 400, status: "Completed" },
      { date: "2026-05-10", doctor: "Dr. Neha Verma", department: "Gynecology", type: "Follow-up", fee: 400, status: "Scheduled" },
    ],
    admissions: [],
    payments: [
      { date: "2026-04-29", mode: "UPI", ref: "TXN9930", purpose: "OPD Consultation", amount: 700 },
      { date: "2026-04-01", mode: "Cash", ref: "RCT-501", purpose: "Follow-up", amount: 400 },
    ],
  },
  "PT-000236": {
    appointments: [
      { date: "2026-04-27", doctor: "Dr. Priya Mehta", department: "Cardiology", type: "Emergency", fee: 1500, status: "Completed" },
      { date: "2026-01-18", doctor: "Dr. Amit Sharma", department: "General Physician", type: "OPD", fee: 500, status: "Completed" },
    ],
    admissions: [
      { id: "ADM-101", admittedOn: "2026-04-27", dischargedOn: null, ward: "Private", bed: "P-102", doctor: "Dr. Priya Mehta", days: 3, wardCharges: 7500, doctorCharges: 3000, medicines: 2100, tests: 5800, advance: 10000, paid: 10000, balance: 8400, status: "Admitted" },
    ],
    payments: [
      { date: "2026-04-27", mode: "Card", ref: "CARD-8890", purpose: "Admission Advance", amount: 10000 },
      { date: "2026-04-27", mode: "Cash", ref: "RCT-622", purpose: "Emergency Consultation", amount: 1500 },
      { date: "2026-01-18", mode: "Cash", ref: "RCT-201", purpose: "OPD Consultation", amount: 500 },
    ],
  },
  "PT-000237": {
    appointments: [
      { date: "2026-04-26", doctor: "Dr. Rajesh Patel", department: "Pediatrics", type: "OPD", fee: 600, status: "Completed" },
    ],
    admissions: [],
    payments: [
      { date: "2026-04-26", mode: "UPI", ref: "TXN9888", purpose: "Pediatric OPD", amount: 600 },
    ],
  },
};

export type DoctorAppointment = {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  patient: string;
  patientId: string;
  age: number;
  gender: string;
  mobile: string;
  reason: string;
  type: "OPD" | "Follow-up" | "Emergency" | "Tele";
  status: "Scheduled" | "Confirmed" | "Done" | "Missed" | "Cancelled";
  notes?: string;
};

const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const doctorSchedule: DoctorAppointment[] = [
  // Past
  { id: "AP-001", date: iso(-7), time: "09:30", patient: "Ravi Kumar", patientId: "PT-000234", age: 34, gender: "Male", mobile: "9988776655", reason: "Fever & cough", type: "OPD", status: "Done", notes: "Prescribed antibiotics" },
  { id: "AP-002", date: iso(-7), time: "10:00", patient: "Mohit Jain", patientId: "PT-000236", age: 52, gender: "Male", mobile: "9988776657", reason: "BP follow-up", type: "Follow-up", status: "Done" },
  { id: "AP-003", date: iso(-5), time: "11:15", patient: "Asha Pillai", patientId: "PT-000240", age: 41, gender: "Female", mobile: "9988776661", reason: "Back pain", type: "OPD", status: "Done" },
  { id: "AP-004", date: iso(-5), time: "11:45", patient: "Vikram Roy", patientId: "PT-000241", age: 29, gender: "Male", mobile: "9988776662", reason: "Skin rash", type: "OPD", status: "Missed" },
  { id: "AP-005", date: iso(-3), time: "10:30", patient: "Sneha Iyer", patientId: "PT-000235", age: 28, gender: "Female", mobile: "9988776656", reason: "General checkup", type: "OPD", status: "Done" },
  { id: "AP-006", date: iso(-3), time: "12:00", patient: "Kavya Nair", patientId: "PT-000237", age: 6, gender: "Female", mobile: "9988776658", reason: "Vaccination", type: "OPD", status: "Done" },
  { id: "AP-007", date: iso(-1), time: "09:00", patient: "Rahul Mehta", patientId: "PT-000242", age: 45, gender: "Male", mobile: "9988776663", reason: "Chest pain review", type: "Follow-up", status: "Done" },
  { id: "AP-008", date: iso(-1), time: "15:30", patient: "Pooja Shah", patientId: "PT-000243", age: 33, gender: "Female", mobile: "9988776664", reason: "Migraine", type: "OPD", status: "Done" },
  // Today
  { id: "AP-009", date: iso(0), time: "10:15", patient: "Ravi Kumar", patientId: "PT-000234", age: 34, gender: "Male", mobile: "9988776655", reason: "Recheck", type: "Follow-up", status: "Done" },
  { id: "AP-010", date: iso(0), time: "10:30", patient: "Sneha Iyer", patientId: "PT-000235", age: 28, gender: "Female", mobile: "9988776656", reason: "Reports review", type: "Follow-up", status: "Confirmed" },
  { id: "AP-011", date: iso(0), time: "10:45", patient: "Mohit Jain", patientId: "PT-000236", age: 52, gender: "Male", mobile: "9988776657", reason: "BP check", type: "OPD", status: "Scheduled" },
  // Future
  { id: "AP-012", date: iso(1), time: "09:30", patient: "Anil Verma", patientId: "PT-000244", age: 60, gender: "Male", mobile: "9988776665", reason: "Diabetes review", type: "Follow-up", status: "Confirmed" },
  { id: "AP-013", date: iso(1), time: "10:00", patient: "Meera Joshi", patientId: "PT-000245", age: 38, gender: "Female", mobile: "9988776666", reason: "Thyroid", type: "OPD", status: "Scheduled" },
  { id: "AP-014", date: iso(2), time: "11:00", patient: "Karan Singh", patientId: "PT-000246", age: 22, gender: "Male", mobile: "9988776667", reason: "Sports injury", type: "OPD", status: "Confirmed" },
  { id: "AP-015", date: iso(3), time: "09:45", patient: "Ritu Sharma", patientId: "PT-000247", age: 50, gender: "Female", mobile: "9988776668", reason: "Annual checkup", type: "OPD", status: "Scheduled" },
  { id: "AP-016", date: iso(4), time: "16:00", patient: "Sneha Iyer", patientId: "PT-000235", age: 28, gender: "Female", mobile: "9988776656", reason: "Follow-up", type: "Tele", status: "Confirmed" },
  { id: "AP-017", date: iso(7), time: "10:30", patient: "Mohit Jain", patientId: "PT-000236", age: 52, gender: "Male", mobile: "9988776657", reason: "Monthly review", type: "Follow-up", status: "Scheduled" },
  { id: "AP-018", date: iso(10), time: "11:15", patient: "Pooja Shah", patientId: "PT-000243", age: 33, gender: "Female", mobile: "9988776664", reason: "Migraine review", type: "Follow-up", status: "Scheduled" },
];

export const todayISO = iso(0);

// ===== Reports detailed datasets =====
export type OPDRecord = { id: string; date: string; token: number; patient: string; patientId: string; doctor: string; department: string; fee: number; status: "Completed" | "Waiting" | "Missed" };
export type AdmissionRecord = { id: string; patient: string; patientId: string; doctor: string; ward: string; bed: string; admittedOn: string; advance: number; status: "Admitted" | "Discharged" };
export type DischargeRecord = {
  id: string; admissionId: string; patient: string; patientId: string; doctor: string; ward: string; bed: string;
  admittedOn: string; dischargedOn: string; days: number;
  wardCharges: number; doctorCharges: number; medicine: number; lab: number; other: number;
  advance: number; total: number; balance: number;
  paymentMode: "Cash" | "UPI" | "Card" | "Insurance"; notes: string;
};
export type CollectionRecord = { id: string; date: string; patient: string; purpose: string; mode: "Cash" | "UPI" | "Card" | "Insurance"; ref: string; amount: number };
export type WardOccupancyRow = { ward: string; total: number; occupied: number; available: number; reserved: number; occupancyPct: number };

export const opdRecords: OPDRecord[] = [
  { id: "OPD-5012", date: todayISO, token: 11, patient: "Ravi Kumar", patientId: "PT-000234", doctor: "Dr. Amit Sharma", department: "General", fee: 500, status: "Completed" },
  { id: "OPD-5013", date: todayISO, token: 12, patient: "Sneha Iyer", patientId: "PT-000235", doctor: "Dr. Amit Sharma", department: "General", fee: 500, status: "Completed" },
  { id: "OPD-5014", date: todayISO, token: 13, patient: "Mohit Jain", patientId: "PT-000236", doctor: "Dr. Priya Mehta", department: "Cardiology", fee: 1000, status: "Waiting" },
  { id: "OPD-5015", date: todayISO, token: 14, patient: "Kavya Nair", patientId: "PT-000237", doctor: "Dr. Neha Verma", department: "Gynecology", fee: 700, status: "Waiting" },
  { id: "OPD-5010", date: iso(-1), token: 22, patient: "Asha Pillai", patientId: "PT-000240", doctor: "Dr. Neha Verma", department: "Gynecology", fee: 700, status: "Completed" },
  { id: "OPD-5009", date: iso(-1), token: 21, patient: "Vikram Roy", patientId: "PT-000241", doctor: "Dr. Amit Sharma", department: "General", fee: 500, status: "Missed" },
  { id: "OPD-5005", date: iso(-2), token: 18, patient: "Pooja Shah", patientId: "PT-000243", doctor: "Dr. Rajesh Patel", department: "Pediatrics", fee: 600, status: "Completed" },
];

export const admissionRecords: AdmissionRecord[] = [
  { id: "ADM-101", patient: "Mohit Jain", patientId: "PT-000236", doctor: "Dr. Priya Mehta", ward: "Private", bed: "P-102", admittedOn: iso(-3), advance: 10000, status: "Admitted" },
  { id: "ADM-102", patient: "Asha Pillai", patientId: "PT-000240", doctor: "Dr. Neha Verma", ward: "Maternity", bed: "M-401", admittedOn: iso(-1), advance: 5000, status: "Admitted" },
  { id: "ADM-099", patient: "Rahul Mehta", patientId: "PT-000242", doctor: "Dr. Priya Mehta", ward: "ICU", bed: "ICU-302", admittedOn: iso(-5), advance: 20000, status: "Discharged" },
  { id: "ADM-088", patient: "Ravi Kumar", patientId: "PT-000234", doctor: "Dr. Priya Mehta", ward: "Private", bed: "P-104", admittedOn: "2026-02-03", advance: 10000, status: "Discharged" },
];

export const dischargeRecords: DischargeRecord[] = [
  { id: "DSC-077", admissionId: "ADM-099", patient: "Rahul Mehta", patientId: "PT-000242", doctor: "Dr. Priya Mehta", ward: "ICU", bed: "ICU-302",
    admittedOn: iso(-5), dischargedOn: iso(-1), days: 4,
    wardCharges: 20000, doctorCharges: 5000, medicine: 4200, lab: 3800, other: 1000,
    advance: 20000, total: 34000, balance: 14000, paymentMode: "Card", notes: "Cardiac observation, stable on discharge." },
  { id: "DSC-076", admissionId: "ADM-088", patient: "Ravi Kumar", patientId: "PT-000234", doctor: "Dr. Priya Mehta", ward: "Private", bed: "P-104",
    admittedOn: "2026-02-03", dischargedOn: "2026-02-08", days: 5,
    wardCharges: 12500, doctorCharges: 5000, medicine: 3200, lab: 4500, other: 0,
    advance: 10000, total: 25200, balance: 15200, paymentMode: "Card", notes: "Recovered, follow-up in 2 weeks." },
  { id: "DSC-075", admissionId: "ADM-080", patient: "Sneha Iyer", patientId: "PT-000235", doctor: "Dr. Neha Verma", ward: "Semi-Private", bed: "S-203",
    admittedOn: iso(-12), dischargedOn: iso(-9), days: 3,
    wardCharges: 4500, doctorCharges: 2100, medicine: 1800, lab: 2200, other: 300,
    advance: 5000, total: 10900, balance: 5900, paymentMode: "UPI", notes: "Routine procedure, no complications." },
];

export const collectionRecords: CollectionRecord[] = [
  { id: "RCT-901", date: todayISO, patient: "Ravi Kumar", purpose: "OPD Consultation", mode: "UPI", ref: "TXN9921", amount: 500 },
  { id: "RCT-902", date: todayISO, patient: "Sneha Iyer", purpose: "OPD Consultation", mode: "Cash", ref: "RCT-902", amount: 500 },
  { id: "RCT-903", date: todayISO, patient: "Mohit Jain", purpose: "Lab Tests", mode: "Card", ref: "CARD-7781", amount: 3500 },
  { id: "RCT-904", date: todayISO, patient: "Asha Pillai", purpose: "Pharmacy", mode: "Cash", ref: "RCT-904", amount: 1200 },
  { id: "RCT-900", date: iso(-1), patient: "Rahul Mehta", purpose: "Discharge Settlement", mode: "Card", ref: "CARD-8801", amount: 14000 },
];

export const wardOccupancyRows: WardOccupancyRow[] = wards.map((w) => {
  const occ = wardOccupancy.find((o) => w.name.includes(o.name.split(" ")[0])) || { used: 0, total: w.beds };
  const occupied = Math.min(occ.used, w.beds);
  const reserved = Math.floor((w.beds - occupied) * 0.2);
  const available = w.beds - occupied - reserved;
  return { ward: w.name, total: w.beds, occupied, available, reserved, occupancyPct: Math.round((occupied / w.beds) * 100) };
});

// ===== Mutable discharge store + audit log (in-memory for prototype) =====
export type DischargeAuditEntry = {
  id: string;
  dischargeId: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string; // ISO datetime
  reason: string;
};

let _discharges: DischargeRecord[] = [...dischargeRecords];
let _auditLog: DischargeAuditEntry[] = [
  { id: "LOG-001", dischargeId: "DSC-076", field: "medicine", oldValue: "3000", newValue: "3200", changedBy: "Anita Singh (Reception)", changedAt: "2026-02-09T10:14:00", reason: "Pharmacy reconciliation" },
  { id: "LOG-002", dischargeId: "DSC-076", field: "paymentMode", oldValue: "Cash", newValue: "Card", changedBy: "Anita Singh (Reception)", changedAt: "2026-02-09T10:15:00", reason: "Patient paid by card" },
];
const _listeners = new Set<() => void>();
const _notify = () => _listeners.forEach((l) => l());

export const dischargeStore = {
  list: () => _discharges,
  audit: () => _auditLog,
  auditFor: (id: string) => _auditLog.filter((a) => a.dischargeId === id).sort((a, b) => b.changedAt.localeCompare(a.changedAt)),
  subscribe: (fn: () => void) => { _listeners.add(fn); return () => { _listeners.delete(fn); }; },
  update: (id: string, changes: Partial<DischargeRecord>, meta: { changedBy: string; reason: string }) => {
    const idx = _discharges.findIndex((d) => d.id === id);
    if (idx === -1) return;
    const prev = _discharges[idx];
    const next = { ...prev, ...changes };
    // Recalc total + balance if numeric fields changed
    next.total = next.wardCharges + next.doctorCharges + next.medicine + next.lab + next.other;
    next.balance = next.total - next.advance;
    const now = new Date().toISOString().slice(0, 19);
    const newEntries: DischargeAuditEntry[] = [];
    (Object.keys(changes) as (keyof DischargeRecord)[]).forEach((k) => {
      if (String(prev[k]) !== String(next[k])) {
        newEntries.push({
          id: "LOG-" + (1000 + _auditLog.length + newEntries.length + 1),
          dischargeId: id, field: String(k),
          oldValue: String(prev[k] ?? ""), newValue: String(next[k] ?? ""),
          changedBy: meta.changedBy, changedAt: now, reason: meta.reason,
        });
      }
    });
    _discharges = [..._discharges.slice(0, idx), next, ..._discharges.slice(idx + 1)];
    _auditLog = [..._auditLog, ...newEntries];
    _notify();
  },
};

// Multi-day reception queue (past, today, future)
const seedQueue: QueueEntry[] = [
  // Past -3
  { token: 1, patient: "Asha Pillai", patientId: "PT-000240", doctor: "Dr. Amit Sharma", date: iso(-3), time: "10:00", status: "Done", mobile: "9988776661" },
  { token: 2, patient: "Vikram Roy", patientId: "PT-000241", doctor: "Dr. Amit Sharma", date: iso(-3), time: "10:15", status: "Done", mobile: "9988776662" },
  { token: 3, patient: "Pooja Shah", patientId: "PT-000243", doctor: "Dr. Neha Verma", date: iso(-3), time: "11:30", status: "Missed", mobile: "9988776664" },
  { token: 4, patient: "Karan Singh", patientId: "PT-000246", doctor: "Dr. Rajesh Patel", date: iso(-3), time: "09:45", status: "Done", mobile: "9988776667" },
  // Past -2
  { token: 1, patient: "Rahul Mehta", patientId: "PT-000242", doctor: "Dr. Amit Sharma", date: iso(-2), time: "10:00", status: "Done", mobile: "9988776663" },
  { token: 2, patient: "Meera Joshi", patientId: "PT-000245", doctor: "Dr. Neha Verma", date: iso(-2), time: "11:15", status: "Done", mobile: "9988776666" },
  { token: 3, patient: "Anil Verma", patientId: "PT-000244", doctor: "Dr. Amit Sharma", date: iso(-2), time: "10:30", status: "Cancelled", mobile: "9988776665" },
  // Past -1
  { token: 1, patient: "Ritu Sharma", patientId: "PT-000247", doctor: "Dr. Amit Sharma", date: iso(-1), time: "10:00", status: "Done", mobile: "9988776668" },
  { token: 2, patient: "Sneha Iyer", patientId: "PT-000235", doctor: "Dr. Neha Verma", date: iso(-1), time: "11:00", status: "Done", mobile: "9988776656" },
  { token: 3, patient: "Mohit Jain", patientId: "PT-000236", doctor: "Dr. Amit Sharma", date: iso(-1), time: "10:45", status: "Missed", mobile: "9988776657" },
  { token: 4, patient: "Kavya Nair", patientId: "PT-000237", doctor: "Dr. Rajesh Patel", date: iso(-1), time: "09:30", status: "Done", mobile: "9988776658" },
  // Today
  { token: 11, patient: "Ravi Kumar", patientId: "PT-000234", doctor: "Dr. Amit Sharma", date: iso(0), time: "10:15", status: "Done", mobile: "9988776655" },
  { token: 12, patient: "Sneha Iyer", patientId: "PT-000235", doctor: "Dr. Amit Sharma", date: iso(0), time: "10:30", status: "In Consultation", mobile: "9988776656" },
  { token: 13, patient: "Mohit Jain", patientId: "PT-000236", doctor: "Dr. Amit Sharma", date: iso(0), time: "10:45", status: "Waiting", mobile: "9988776657" },
  { token: 14, patient: "Kavya Nair", patientId: "PT-000237", doctor: "Dr. Neha Verma", date: iso(0), time: "11:00", status: "Waiting", mobile: "9988776658" },
  { token: 15, patient: "Asha Pillai", patientId: "PT-000240", doctor: "Dr. Neha Verma", date: iso(0), time: "11:15", status: "Waiting", mobile: "9988776661" },
  // Tomorrow +1
  { token: 1, patient: "Anil Verma", patientId: "PT-000244", doctor: "Dr. Amit Sharma", date: iso(1), time: "10:00", status: "Scheduled", mobile: "9988776665" },
  { token: 2, patient: "Meera Joshi", patientId: "PT-000245", doctor: "Dr. Amit Sharma", date: iso(1), time: "10:15", status: "Scheduled", mobile: "9988776666" },
  { token: 3, patient: "Ravi Kumar", patientId: "PT-000234", doctor: "Dr. Neha Verma", date: iso(1), time: "11:30", status: "Scheduled", mobile: "9988776655" },
  // +2
  { token: 1, patient: "Karan Singh", patientId: "PT-000246", doctor: "Dr. Rajesh Patel", date: iso(2), time: "09:45", status: "Scheduled", mobile: "9988776667" },
  { token: 2, patient: "Pooja Shah", patientId: "PT-000243", doctor: "Dr. Amit Sharma", date: iso(2), time: "10:30", status: "Scheduled", mobile: "9988776664" },
  // +3
  { token: 1, patient: "Ritu Sharma", patientId: "PT-000247", doctor: "Dr. Amit Sharma", date: iso(3), time: "10:00", status: "Scheduled", mobile: "9988776668" },
  { token: 2, patient: "Sneha Iyer", patientId: "PT-000235", doctor: "Dr. Neha Verma", date: iso(3), time: "11:15", status: "Scheduled", mobile: "9988776656" },
];
receptionQueue.push(...seedQueue);
queue = seedQueue.filter(q => q.date === todayISO);

// ===== Patients Under Investigation (Doctor portal) =====
export type InvestigationTest = {
  name: string;
  orderedOn: string;
  status: "Pending" | "Sample Collected" | "Reported" | "Awaiting Review";
  result?: string;
  flag?: "Normal" | "Abnormal" | "Critical";
};
export type InvestigationCase = {
  id: string;
  patient: string;
  patientId: string;
  age: number;
  gender: string;
  mobile: string;
  doctor: string;
  startedOn: string;
  lastVisit: string;
  nextReview: string;
  location: "OPD" | "IPD" | "Day Care";
  ward?: string;
  bed?: string;
  provisionalDx: string;
  symptoms: string[];
  vitals: { bp: string; pulse: number; temp: string; spo2: number };
  tests: InvestigationTest[];
  medications: string[];
  notes: string;
  priority: "Routine" | "Urgent" | "Critical";
  status: "Tests Pending" | "Awaiting Reports" | "Under Observation" | "Diagnosis Pending";
};

export const investigations: InvestigationCase[] = [
  {
    id: "INV-2001", patient: "Mohit Jain", patientId: "PT-000236", age: 52, gender: "Male", mobile: "9988776657",
    doctor: "Dr. Amit Sharma", startedOn: iso(-3), lastVisit: iso(-1), nextReview: iso(1),
    location: "IPD", ward: "Private", bed: "P-102",
    provisionalDx: "Suspected Coronary Artery Disease",
    symptoms: ["Chest pain on exertion", "Shortness of breath", "Fatigue"],
    vitals: { bp: "150/95", pulse: 92, temp: "98.6°F", spo2: 96 },
    tests: [
      { name: "ECG", orderedOn: iso(-3), status: "Reported", result: "ST depression in V4-V6", flag: "Abnormal" },
      { name: "Troponin-I", orderedOn: iso(-3), status: "Reported", result: "0.08 ng/mL", flag: "Abnormal" },
      { name: "2D Echo", orderedOn: iso(-2), status: "Awaiting Review", result: "EF 48%, mild LV dysfunction", flag: "Abnormal" },
      { name: "Coronary Angiography", orderedOn: iso(-1), status: "Pending" },
      { name: "Lipid Profile", orderedOn: iso(-3), status: "Reported", result: "LDL 168, HDL 32", flag: "Abnormal" },
    ],
    medications: ["Aspirin 75mg OD", "Atorvastatin 40mg HS", "Metoprolol 25mg BD"],
    notes: "Family h/o IHD. Awaiting angiography slot. Keep NPO from 8 PM tonight.",
    priority: "Urgent",
    status: "Awaiting Reports",
  },
  {
    id: "INV-2002", patient: "Sneha Iyer", patientId: "PT-000235", age: 28, gender: "Female", mobile: "9988776656",
    doctor: "Dr. Amit Sharma", startedOn: iso(-5), lastVisit: iso(0), nextReview: iso(2),
    location: "OPD",
    provisionalDx: "PUO (Pyrexia of Unknown Origin)",
    symptoms: ["Intermittent fever 10 days", "Joint pain", "Mild rash"],
    vitals: { bp: "118/76", pulse: 88, temp: "101.2°F", spo2: 98 },
    tests: [
      { name: "CBC", orderedOn: iso(-5), status: "Reported", result: "WBC 12.4k, Hb 11.2", flag: "Abnormal" },
      { name: "Dengue NS1", orderedOn: iso(-5), status: "Reported", result: "Negative", flag: "Normal" },
      { name: "Malaria Parasite", orderedOn: iso(-5), status: "Reported", result: "Not detected", flag: "Normal" },
      { name: "Widal Test", orderedOn: iso(-3), status: "Reported", result: "TO 1:160, TH 1:80", flag: "Abnormal" },
      { name: "Blood Culture", orderedOn: iso(-3), status: "Pending" },
      { name: "ANA Profile", orderedOn: iso(-1), status: "Sample Collected" },
    ],
    medications: ["Paracetamol 650mg SOS", "Ceftriaxone 1g IV BD"],
    notes: "Suspected enteric fever vs autoimmune. Awaiting blood culture & ANA.",
    priority: "Routine",
    status: "Tests Pending",
  },
  {
    id: "INV-2003", patient: "Ravi Kumar", patientId: "PT-000234", age: 34, gender: "Male", mobile: "9988776655",
    doctor: "Dr. Amit Sharma", startedOn: iso(-2), lastVisit: iso(0), nextReview: iso(3),
    location: "OPD",
    provisionalDx: "R/O Type 2 Diabetes Mellitus",
    symptoms: ["Polyuria", "Polydipsia", "Weight loss 4 kg / 2 months"],
    vitals: { bp: "128/82", pulse: 78, temp: "98.4°F", spo2: 99 },
    tests: [
      { name: "FBS", orderedOn: iso(-2), status: "Reported", result: "168 mg/dL", flag: "Abnormal" },
      { name: "PPBS", orderedOn: iso(-2), status: "Reported", result: "246 mg/dL", flag: "Abnormal" },
      { name: "HbA1c", orderedOn: iso(-2), status: "Awaiting Review", result: "8.4%", flag: "Abnormal" },
      { name: "Urine Routine", orderedOn: iso(-2), status: "Reported", result: "Glucose +++, Ketones nil", flag: "Abnormal" },
      { name: "Fundus Examination", orderedOn: iso(0), status: "Pending" },
    ],
    medications: ["Metformin 500mg BD (started)"],
    notes: "Newly detected DM. Counsel for diet & exercise. Review with fundus report.",
    priority: "Routine",
    status: "Diagnosis Pending",
  },
  {
    id: "INV-2004", patient: "Rahul Mehta", patientId: "PT-000242", age: 45, gender: "Male", mobile: "9988776663",
    doctor: "Dr. Amit Sharma", startedOn: iso(-1), lastVisit: iso(0), nextReview: iso(0),
    location: "IPD", ward: "ICU", bed: "ICU-303",
    provisionalDx: "Acute Pancreatitis",
    symptoms: ["Severe epigastric pain", "Vomiting", "Abdominal distension"],
    vitals: { bp: "100/68", pulse: 112, temp: "100.4°F", spo2: 94 },
    tests: [
      { name: "Serum Amylase", orderedOn: iso(-1), status: "Reported", result: "892 U/L", flag: "Critical" },
      { name: "Serum Lipase", orderedOn: iso(-1), status: "Reported", result: "1240 U/L", flag: "Critical" },
      { name: "USG Abdomen", orderedOn: iso(-1), status: "Reported", result: "Bulky pancreas, peripancreatic fluid", flag: "Abnormal" },
      { name: "CECT Abdomen", orderedOn: iso(0), status: "Sample Collected" },
      { name: "LFT", orderedOn: iso(-1), status: "Reported", result: "Bilirubin 2.1, ALT 84", flag: "Abnormal" },
    ],
    medications: ["IV Fluids RL @ 150 ml/hr", "Tramadol 50mg IV TDS", "Pantoprazole 40mg IV BD", "NPO"],
    notes: "Critical — monitor vitals q2h. CECT to assess severity. Surgery on standby.",
    priority: "Critical",
    status: "Under Observation",
  },
  {
    id: "INV-2005", patient: "Kavya Nair", patientId: "PT-000237", age: 6, gender: "Female", mobile: "9988776658",
    doctor: "Dr. Rajesh Patel", startedOn: iso(-2), lastVisit: iso(0), nextReview: iso(2),
    location: "Day Care",
    provisionalDx: "R/O Iron Deficiency Anemia",
    symptoms: ["Pallor", "Fatigue", "Poor appetite"],
    vitals: { bp: "96/62", pulse: 102, temp: "98.2°F", spo2: 99 },
    tests: [
      { name: "CBC", orderedOn: iso(-2), status: "Reported", result: "Hb 8.4, MCV 68", flag: "Abnormal" },
      { name: "Peripheral Smear", orderedOn: iso(-2), status: "Reported", result: "Microcytic hypochromic", flag: "Abnormal" },
      { name: "Serum Ferritin", orderedOn: iso(-1), status: "Pending" },
      { name: "Stool for OB", orderedOn: iso(-1), status: "Sample Collected" },
    ],
    medications: ["Iron syrup 5ml BD", "Vitamin C supplement"],
    notes: "Dietary counselling done with parent. Review with ferritin report.",
    priority: "Routine",
    status: "Tests Pending",
  },
];

