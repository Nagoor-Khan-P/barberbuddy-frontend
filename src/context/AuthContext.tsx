'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setAuthTokenState(token);

    if (token) {
      fetchUserProfile(token); // 🔄 Fetch user profile on load if token exists
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/customer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const userData = await response.json();

      // Store important fields in localStorage
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('username', userData.username); // optional
      // Store more fields if needed
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('authToken', token);
      setAuthTokenState(token);
      fetchUserProfile(token); // 👈 Fetch profile on login
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      setAuthTokenState(null);
    }
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
