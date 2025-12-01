// src/services/deanService.ts
import axiosInstance from "@/utils/axiosInstance";

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
  password: string;
  assigned_since: string | null;
  createdAt: string;
  updatedAt: string;

}

export async function getteachers(): Promise<Teacher[]> {
  const res = await axiosInstance.get("/users/all-teachers");
  return res.data;
}


export async function getTeacherById(userId: string): Promise<Teacher> {
  const res = await axiosInstance.get(`/users/retrieved/${userId}`);
  return res.data;
}