// context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthTokenState(token);
  }, []);

  const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    setAuthTokenState(token);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
