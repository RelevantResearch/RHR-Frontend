"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/lib/types";
import { login_api } from "@/api/auth";
import { getMyInfo, updateUserProfile } from "@/api/user";
import { useLoading } from "@/lib/loading-context";
import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from "./utils";
 
interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = getFromLocalStorage("accessToken") as string | null;
        const storedUser = getFromLocalStorage("user") as User | null;

        console.log("[Auth] User:", storedUser);

        if (!storedToken || !storedUser || !storedUser.role) {
          console.log("[Auth] Missing token or role. Logging out.");
          removeFromLocalStorage("user");
          removeFromLocalStorage("accessToken");
          setUser(null);
          setAccessToken(null);
          setIsLoading(false);
          return;
        }

        setUser(storedUser);
        setAccessToken(storedToken);
      } catch (error) {
        console.error("[Auth] Auth check failed:", error);
        removeFromLocalStorage("user");
        removeFromLocalStorage("accessToken");
        setUser(null);
        setAccessToken(null);
      } finally {
        // console.log("[Auth] Auth check complete.");
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    showLoading("Taking you in...");
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    try {
      const response = await login_api(email, password);

      // ❗ Validate the response
      if (!response?.user || !response?.accessToken) {
        throw new Error("Invalid credentials");
      }

      const userWithRole: User = {
        ...response.user,
        role: response.user.UserRole?.[0]?.role || null,
      };

      setUser(userWithRole);
      setAccessToken(response.accessToken);
      setToLocalStorage("user", userWithRole);
      setToLocalStorage("accessToken", response.accessToken);

      document.cookie = `user=${encodeURIComponent(JSON.stringify(userWithRole))}; path=/`;
      document.cookie = `accessToken=${response.accessToken}; path=/`;
    } catch (err) {
      console.error("[Login] Failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };


  const logout = async () => {
    showLoading("Signing you out...");
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    try {
      removeFromLocalStorage("user");
      removeFromLocalStorage("accessToken");
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("User not authenticated");

    try {
      const updatedUser = await updateUserProfile(data);
      const merged = { ...user, ...data };
      setUser(merged);
      setToLocalStorage("user", merged);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, isLoading, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};