"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, login, logout, AuthUser } from "@/services/authService";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>; // Add this to manually refresh user
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => null,
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // Check if we're on a public page (signin, signup, reset-password)
      if (typeof window !== 'undefined') {
        const publicPaths = ['/signin', '/signup', '/reset-password', '/login'];
        const currentPath = window.location.pathname;
        
        // Don't try to load user on public pages
        if (publicPaths.some(path => currentPath.includes(path))) {
          setLoading(false);
          return;
        }
      }

      // Only try to get current user on protected pages
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to load user:", err);
        
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  async function refreshUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      setUser(null);
    }
  }

  async function handleLogin(email: string, password: string): Promise<AuthUser | null> {
    try {
      const loggedInUser = await login({ email, password });
      if (loggedInUser) {
        setUser(loggedInUser);
        return loggedInUser;
      }
      return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.message || "Login failed");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if logout fails, clear the user state
      setUser(null);
    } finally {
      // Ensure we redirect after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login: handleLogin, logout: handleLogout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);