export interface Section {
  departmentId: string;
  sectionId: string;
  name: string;
  code: string;
  yearLevel: number;
  semesterId: string;
  semesterName: string;
  courseId: string;
  courseTitle: string;
  maxStudents: number;
  status: string;
  createdAt: string; // ISO date string (from LocalDateTime)
  updatedAt: string; // ISO date string (from LocalDateTime)
}
import axiosInstance from "@/utils/axiosInstance";

export async function getSections(): Promise<Section[]> {
  const res = await axiosInstance.get("/sections");
  return res.data;
}

export async function getSectionsByDepartmentid(departmentId: string): Promise<Section[]> {
  const res = await axiosInstance.get(`/sections/${departmentId}`);
  return res.data;
}

export async function createSection(
  section: Omit<Section, "sectionId" | "createdAt" | "updatedAt">
): Promise<Section> {
  const res = await axiosInstance.post("/sections/create", section);
  return res.data;
}

export async function updateSection(
  sectionId: string,
  section: Partial<Omit<Section, "sectionId" | "createdAt" | "updatedAt">>
): Promise<Section> {
  const res = await axiosInstance.put(`/sections/update/${sectionId}`, section);
  return res.data;
}

export async function deleteSection(sectionId: string): Promise<void> {
  await axiosInstance.delete(`/sections/delete/${sectionId}`);
}