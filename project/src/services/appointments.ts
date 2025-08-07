import { api } from "./client";

export async function createAppointment(payload: {
  salon_id: string | number;
  service_id: string | number;
  date: string; // ISO
}) {
  const { data } = await api.post("/appointments", payload);
  return data;
}

export async function getMyAppointments() {
  const { data } = await api.get("/appointments/my");
  return data;
}

export async function getSalonAppointments(salonId: string | number) {
  const { data } = await api.get(`/appointments/salon/${salonId}`);
  return data;
}

export async function updateAppointmentStatus(appointmentId: string | number, status: "zakazano" | "završeno" | "otkazano") {
  const { data } = await api.put(`/appointments/${appointmentId}/status`, { status });
  return data;
} 