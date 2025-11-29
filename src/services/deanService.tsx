// src/services/deanService.ts
import axiosInstance from "@/utils/axiosInstance";

export interface Dean {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  departmentName: string;
  departmentId: string;
  role: "ROLE_DEAN";
  isActive: boolean;
  profile_picture: string | null;
  password: string;
  assigned_since: string | null;
}

export async function getDeans(): Promise<Dean[]> {
  const res = await axiosInstance.get("/users/all-deans");
  return res.data;
}
