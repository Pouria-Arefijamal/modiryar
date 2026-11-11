"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode: no backend API URL at build time (e.g. static GitHub Pages deploy)
const DEMO_MODE = !process.env.NEXT_PUBLIC_API_URL;

const DEMO_USER: User = {
  id: "demo-admin",
  email: "admin@modiryar.ir",
  name: "مدیر دمو",
  role: "admin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (data: LoginRequest) => {
    if (data.email !== "admin@modiryar.ir" || data.password !== "admin123") {
      toast.error("ایمیل یا رمز عبور اشتباه است");
      throw new Error("invalid credentials");
    }
    localStorage.setItem("token", "demo-token-modiryar-admin");
    localStorage.setItem("user", JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    toast.success("خوش آمدید!");
    router.push("/projects");
  };

  const login = async (data: LoginRequest) => {
    if (DEMO_MODE) {
      await demoLogin(data);
      return;
    }
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      toast.success("خوش آمدید!");
      router.push("/projects");
    } catch (error: any) {
      const message = error.response?.data?.error || "ورود ناموفق بود";
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    if (DEMO_MODE) {
      toast.success("ثبت‌نام موفقیت‌آمیز بود. لطفاً وارد شوید.");
      router.push("/login");
      return;
    }
    try {
      await api.post("/auth/register", data);
      toast.success("ثبت‌نام موفقیت‌آمیز بود. لطفاً وارد شوید.");
      router.push("/login");
    } catch (error: any) {
      const message = error.response?.data?.error || "ثبت‌نام ناموفق بود";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
    toast.success("خروج موفقیت‌آمیز");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
