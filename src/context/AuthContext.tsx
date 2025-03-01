import { BACKEND_URL } from '../lib/config';
import { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthChecked:boolean,
  login: (email: string, password: string,adminPassword:string) => Promise<void>;
  signup: (name: string, email: string, password: string, adminPassword: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setIsAuthenticated(true);
  }
  setIsAuthChecked(true); // Mark auth check as completed
}, []);

if (!isAuthChecked) {
  return null; // Render nothing until auth check completes
}


  const login = async (email: string, password: string, adminPassword: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          adminPassword,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message|| errorData.msg || 'Failed to login'); ;
      }
  
      const data = await response.json();
      // Example: Assuming the API sends a token on success
      if (data.token) {
        localStorage.setItem('authToken', data.token); // Store token if needed
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw error for UI handling
    }
  };
  
  const signup = async (name: string, email: string, password: string, adminPassword: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          adminPassword,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || errorData.msg || 'Failed to sign up');
      }
  
      const data = await response.json();
      // Similar to login, store token if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Re-throw error for UI handling
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,isAuthChecked, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

