// src/services/deanService.ts
import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockUsers } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

// export interface Teacher {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string | null;
//   departmentName: string;
//   departmentId: string;
//   role: "ROLE_TEACHER";
//   isActive: boolean;
//   profile_picture: string | null;
//   password: string;
//   assigned_since: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// export async function getteachers(): Promise<Teacher[]> {
//   const res = await axiosInstance.get("/users/all-teachers");
//   return res.data;
// }


// export async function getTeacherById(userId: string): Promise<Teacher> {
//   const res = await axiosInstance.get(`/users/retrieved/${userId}`);
//   return res.data;
// }

export interface Teacher {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  departmentName: string;
  departmentId: string;
  role: "ROLE_TEACHER";
  isActive: boolean;
  profile_picture: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getTeachers(): Promise<Teacher[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockUsers
      .filter(u => u.role === "ROLE_TEACHER")
      .map(u => ({
        ...u,
        role: "ROLE_TEACHER" as const,
      })) as Teacher[];
  }
  const res = await axiosInstance.get("/users/all-teachers");
  return res.data;
}

export async function getTeacherById(userId: string): Promise<Teacher> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    const teacher = mockUsers.find(u => u.userId === userId && u.role === "ROLE_TEACHER");
    if (!teacher) throw new Error(`Teacher ${userId} not found`);
    return teacher as unknown as Teacher;
  }
  const res = await axiosInstance.get(`/users/retrieved/${userId}`);
  return res.data;
}
