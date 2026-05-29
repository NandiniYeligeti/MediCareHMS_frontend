import { createFileRoute } from "@tanstack/react-router";
import { StaffPage } from "./management.staff";

export const Route = createFileRoute("/reception/staff")({
  component: StaffPage,
});
