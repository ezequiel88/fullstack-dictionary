"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthSignIn, AuthSignUp } from "@/types";
import { loginAction, registerAction, logoutAction, getUserProfile } from "@/actions";
import { isAuthenticated } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (data: AuthSignIn) => Promise<void>;
  signUp: (data: AuthSignUp) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (isInitialLoad = false) => {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const result = await getUserProfile();
        if (result.success) {
          setUser(result.data);
        } else {
          if (isInitialLoad) {
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch {
      if (isInitialLoad) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser(true);
  }, []);

  const signIn = async (data: AuthSignIn) => {
    setIsLoading(true);
    try {
      const result = await loginAction(data);
      if (result.success) {
        await refreshUser();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (data: AuthSignUp) => {
    setIsLoading(true);
    try {
      const result = await registerAction(data);
      if (result.success) {
        await refreshUser();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await logoutAction();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser: () => refreshUser(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}