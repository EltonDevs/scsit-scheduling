// src/services/deanService.ts
import { MOCK_CONFIG, delay } from "@/config/mockConfig";
import { mockUsers } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

// export interface Dean {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string | null;
//   departmentName: string;
//   departmentId: string;
//   role: "ROLE_DEAN";
//   isActive: boolean;
//   profile_picture: string | null;
//   password: string;
//   assigned_since: string | null;
//  createdAt: string;
//   updatedAt: string;
// }

// export async function getDeans(): Promise<Dean[]> {
//   const res = await axiosInstance.get("/users/all-deans");
//   return res.data;
// }


// export async function getDeanById(userId: string): Promise<Dean> {
//   const res = await axiosInstance.get(`/users/retrieved/${userId}`);
//   return res.data;
// }

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
 createdAt: string;
  updatedAt: string;
}

export async function getDeans(): Promise<Dean[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockUsers
      .filter(u => u.role === "ROLE_DEAN")
      .map(u => ({
        ...u,
        role: "ROLE_DEAN" as const,
      })) as Dean[];
  }
  const res = await axiosInstance.get("/users/all-deans");
  return res.data;
}

export async function getDeanById(userId: string): Promise<Dean> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    const dean = mockUsers.find(u => u.userId === userId && u.role === "ROLE_DEAN");
    if (!dean) throw new Error(`Dean ${userId} not found`);
    return dean as unknown as Dean;
  }
  const res = await axiosInstance.get(`/users/retrieved/${userId}`);
  return res.data;
}