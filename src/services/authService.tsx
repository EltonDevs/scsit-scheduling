/* eslint-disable @typescript-eslint/no-explicit-any */

// import axiosInstance from "@/utils/axiosInstance";


// export interface AuthUser {
//   role: string;
//   firstName: string;
//   lastName: string;
//   email: string,
//   departmentId?: string;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }


// export async function getCurrentUser(): Promise<AuthUser | null> {
//   try {
//     const res = await axiosInstance.get("/auth/me");
//     return res.data;
//   } catch  {
    
//     // console.error("getCurrentUser error:", err);
//     return null;
//   }
// }

// export async function login(data: LoginRequest): Promise<AuthUser | null> {
//   try {
//     const res = await axiosInstance.post("/auth/login", data);
//     return res.data;
//   } catch (err: any) {
//     const message = err.response?.data?.message || "Invalid email or password";
//     throw new Error(message);
//   }
// }

// export async function logout(): Promise<void> {
//   await axiosInstance.post("/auth/logout");
// }



import axiosInstance from "@/utils/axiosInstance";
import { MOCK_CONFIG, delay } from "@/config/mockConfig";
import { mockUsers } from "@/data/all-data-context";

export interface AuthUser {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    // Return first admin user as logged in
    const user = mockUsers[0];
    return {
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      departmentId: user.departmentId || undefined,
    };
  }

  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}

export async function login(data: LoginRequest): Promise<AuthUser | null> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    
    // Find user by email
    const user = mockUsers.find(u => u.email === data.email);
    
    if (!user || data.password !== "password123") {
      throw new Error("Invalid email or password");
    }

    return {
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      departmentId: user.departmentId || undefined,
    };
  }

  try {
    const res = await axiosInstance.post("/auth/login", data);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const message = err.response?.data?.message || "Invalid email or password";
    throw new Error(message);
  }
}

export async function logout(): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    return;
  }
  await axiosInstance.post("/auth/logout");
}