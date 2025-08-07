import { api, setToken, clearToken, getToken } from './client';

export type Role = "client" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  created_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Streamlined function-based API (new approach)
export async function register(payload: {
  email: string;
  password: string;
  role: Role;
  name?: string;
}) {
  const { data } = await api.post("/auth/register", payload);
  if (data?.token) setToken(data.token);
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", payload);
  if (data?.token) setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
  localStorage.removeItem('user');
  // Redirect na login stranicu
  window.location.href = '/prijava';
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}

// Class-based API (for backward compatibility)
class AuthService {
  // Login korisnika
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      const { user, token } = response.data;
      
      // Sačuvaj token i user data u localStorage
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Greška pri prijavi');
    }
  }

  // Registracija novog korisnika
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;
      
      // Sačuvaj token i user data u localStorage
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Greška pri registraciji');
    }
  }

  // Dohvati profil trenutnog korisnika
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      return response.data.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Greška pri dohvatanju profila');
    }
  }

  // Dohvati podatke o trenutnom korisniku (alternativna metoda)
  async getMe(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Greška pri dohvatanju korisnika');
    }
  }

  // Logout korisnika
  logout(): void {
    clearToken();
    localStorage.removeItem('user');
    // Redirect na login stranicu
    window.location.href = '/prijava';
  }

  // Proveri da li je korisnik ulogovan
  isAuthenticated(): boolean {
    return !!getToken();
  }

  // Dohvati trenutnog korisnika iz localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Dohvati token
  getAuthToken(): string | null {
    return getToken();
  }
}

export default new AuthService(); 