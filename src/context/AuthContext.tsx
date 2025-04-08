
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User } from "@/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage key for users
const USERS_STORAGE_KEY = "sorte-paratodos-users";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Carregar usuários do localStorage
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [{ username: "admin", password: "123456" }];
    
    // Verificar credenciais
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      setIsAuthenticated(true);
      setUser(username);
      localStorage.setItem('auth-user', username);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
