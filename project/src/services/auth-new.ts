import { api, setToken, clearToken } from "./client";

export type Role = "client" | "owner" | "admin";

export async function register(payload: {
  email: string;
  password: string;
  role: Role;
  name?: string;
}) {
  const { data } = await api.post("/register", payload);
  if (data?.token) setToken(data.token);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post("/login", payload);
  if (data?.token) setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}

export async function me() {
  const { data } = await api.get("/me");
  return data;
} 