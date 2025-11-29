import axiosInstance from "@/utils/axiosInstance";

export interface Semester {
  semesterId: string;       // UUID (string in TS)
  name: string;             // Semester name (e.g., "1st Semester 2025")
  startDate: string;        // ISO date string (from LocalDate in Java)
  endDate: string;          // ISO date string
  isCurrent: boolean;       // whether this semester is active
  createdAt: string;        // ISO datetime string (from LocalDateTime)
  updatedAt: string;        // ISO datetime string
}

export async function getSemester(): Promise<Semester[]> {
  const res = await axiosInstance.get("/semesters");
  return res.data;
}