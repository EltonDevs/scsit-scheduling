// import axiosInstance from "@/utils/axiosInstance";

// export interface Semester {
//   semesterId: string;       // UUID (string in TS)
//   name: string;             // Semester name (e.g., "1st Semester 2025")
//   startDate: string;        // ISO date string (from LocalDate in Java)
//   endDate: string;          // ISO date string
//   isCurrent: boolean;       // whether this semester is active
//   createdAt: string;        // ISO datetime string (from LocalDateTime)
//   updatedAt: string;        // ISO datetime string
// }

// export async function getSemester(): Promise<Semester[]> {
//   const res = await axiosInstance.get("/semesters");
//   return res.data;
// }

import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockSemesters } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

export interface Semester {
  semesterId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockSemestersData = [...mockSemesters];

export async function getSemester(): Promise<Semester[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockSemestersData;
  }
  const res = await axiosInstance.get("/semesters");
  return res.data;
}

export async function getSemesterById(semesterId: string): Promise<Semester> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    const semester = mockSemestersData.find(s => s.semesterId === semesterId);
    if (!semester) throw new Error(`Semester ${semesterId} not found`);
    return semester;
  }
  const res = await axiosInstance.get(`/semesters/${semesterId}`);
  return res.data;
}

export async function createSemester(
  semester: Omit<Semester, "semesterId" | "createdAt" | "updatedAt">
): Promise<Semester> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const newSemester: Semester = {
      ...semester,
      semesterId: `sem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSemestersData.push(newSemester);
    return newSemester;
  }
  const res = await axiosInstance.post("/semesters/create", semester);
  return res.data;
}

export async function updateSemester(
  semesterId: string,
  semester: Partial<Omit<Semester, "semesterId" | "createdAt" | "updatedAt">>
): Promise<Semester> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockSemestersData.findIndex(s => s.semesterId === semesterId);
    if (index === -1) throw new Error(`Semester ${semesterId} not found`);
    mockSemestersData[index] = {
      ...mockSemestersData[index],
      ...semester,
      updatedAt: new Date().toISOString(),
    };
    return mockSemestersData[index];
  }
  const res = await axiosInstance.put(`/semesters/update/${semesterId}`, semester);
  return res.data;
}

export async function deleteSemester(semesterId: string): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockSemestersData.findIndex(s => s.semesterId === semesterId);
    if (index === -1) throw new Error(`Semester ${semesterId} not found`);
    mockSemestersData.splice(index, 1);
    return;
  }
  await axiosInstance.delete(`/semesters/delete/${semesterId}`);
}