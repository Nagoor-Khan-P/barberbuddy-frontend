'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface RoleType {
  id: string;
  name: string;
  description: string;
}
interface UserType {
  id: string;
  username: string;
  roles: RoleType[];
}

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthTokenState(token);
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const userData: UserType = await response.json();
      setUser(userData); // update context

      // Optional: store in localStorage for persistence (not necessary if only using context)
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('authToken', token);
      setAuthTokenState(token);
      fetchUserProfile(token);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setAuthTokenState(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
