import React, { createContext, useContext } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: { login: string; email: string } | null;
  login: (login: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  currentUser: null,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);
