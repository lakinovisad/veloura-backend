import { api } from "./client";

export async function getSalons() {
  const { data } = await api.get("/salons");
  return data;
}

export async function getSalonServices(salonId: string | number) {
  const { data } = await api.get(`/services/salon/${salonId}`);
  return data;
} 