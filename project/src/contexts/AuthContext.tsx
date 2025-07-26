import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { User, LoginData, RegisterData } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicijalizacija - proveri da li je korisnik već ulogovan
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          const currentUser = AuthService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Ako nema user data, pokušaj da dohvatiš sa servera
            await refreshUser();
          }
        }
      } catch (error) {
        console.error('Greška pri inicijalizaciji auth:', error);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login funkcija
  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register funkcija
  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await AuthService.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout funkcija
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await AuthService.getProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Greška pri refresh-u user data:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook za korišćenje AuthContext-a
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth mora biti korišćen unutar AuthProvider-a');
  }
  return context;
}; 