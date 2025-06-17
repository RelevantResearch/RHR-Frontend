"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "@/lib/types";
import { login_api } from "@/api/auth";
import { updateUserProfile } from "@/api/user";
import { useLoading } from '@/lib/loading-context';
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "./utils";
import { getMyInfo } from "@/api/user";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     // showLoading("Checking Authentication...");
  //     try {
  //       const storedUser = getFromLocalStorage("user");
  //       const accessToken = getFromLocalStorage("accessToken");

  //       if (accessToken) {
  //         // If there's an access token, verify it by fetching user info
  //         const userInfo = await getMyInfo();
  //         setUser(userInfo);
  //         setToLocalStorage("user", userInfo);
  //         setAccessToken(accessToken);
  //       } else if (storedUser) {
  //         // Fallback to stored user if no token (optional)
  //         setUser(storedUser);
  //       }
  //     } catch (error) {
  //       console.error("Authentication check failed:", error);
  //       // Clear invalid credentials
  //       removeFromLocalStorage("user");
  //       removeFromLocalStorage("accessToken");
  //       setUser(null);
  //       setAccessToken(null);
  //     } finally {
  //       setIsLoading(false);
  //       // hideLoading();

  //     }
  //   };

  //   checkAuth();
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = getFromLocalStorage("accessToken");
        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        const userInfo = await getMyInfo();
        if (!userInfo || !userInfo.role) {
          throw new Error("Invalid user data");
        }

        setUser(userInfo);
        setAccessToken(accessToken);
        setToLocalStorage("user", userInfo);
      } catch (error) {
        console.error("Auth check failed:", error);
        removeFromLocalStorage("user");
        removeFromLocalStorage("accessToken");
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    showLoading("Taking you in...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(true);
    try {
      const { user, accessToken } = await login_api(email, password);
      setToLocalStorage("user", user);
      setToLocalStorage("accessToken", accessToken);
      setUser(user);
      setAccessToken(accessToken);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const logout = async () => {
    showLoading('Signing you out...');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
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
    if (user) {
      try {
        const updatedUser = await updateUserProfile(data);
        const newUser = { ...user, ...data };
        setToLocalStorage("user", newUser);
        setUser(newUser);
        return updatedUser;
      } catch (error) {
        console.error("Failed to update profile:", error);
        throw error;
      }
    }
    throw new Error("User is not authenticated.");
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};