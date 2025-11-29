/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosInstance";


export interface AuthUser {
  role: string;
  firstName: string;
  lastName: string;
  email: string,
  departmentId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}


export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch  {
    
    // console.error("getCurrentUser error:", err);
    return null;
  }
}

export async function login(data: LoginRequest): Promise<AuthUser | null> {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Invalid email or password";
    throw new Error(message);
  }
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}