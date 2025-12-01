// export interface Section {
//   departmentId: string;
//   sectionId: string;
//   name: string;
//   code: string;
//   yearLevel: number;
//   semesterId: string;
//   semesterName: string;
//   courseId: string;
//   courseTitle: string;
//   maxStudents: number;
//   status: string;
//   createdAt: string; // ISO date string (from LocalDateTime)
//   updatedAt: string; // ISO date string (from LocalDateTime)
// }
// import axiosInstance from "@/utils/axiosInstance";

// export async function getSections(): Promise<Section[]> {
//   const res = await axiosInstance.get("/sections");
//   return res.data;
// }

// export async function getSectionsByDepartmentid(departmentId: string): Promise<Section[]> {
//   const res = await axiosInstance.get(`/sections/${departmentId}`);
//   return res.data;
// }

// export async function createSection(
//   section: Omit<Section, "sectionId" | "createdAt" | "updatedAt">
// ): Promise<Section> {
//   const res = await axiosInstance.post("/sections/create", section);
//   return res.data;
// }

// export async function updateSection(
//   sectionId: string,
//   section: Partial<Omit<Section, "sectionId" | "createdAt" | "updatedAt">>
// ): Promise<Section> {
//   const res = await axiosInstance.put(`/sections/update/${sectionId}`, section);
//   return res.data;
// }

// export async function deleteSection(sectionId: string): Promise<void> {
//   await axiosInstance.delete(`/sections/delete/${sectionId}`);
// }

import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockSections } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

export interface Section {
  departmentId: string;
  departmentName?: string;
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

const mockSectionsData = [...mockSections];

export async function getSections(): Promise<Section[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockSectionsData;
  }
  const res = await axiosInstance.get("/sections");
  return res.data;
}

export async function getSectionsByDepartmentid(departmentId: string): Promise<Section[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockSectionsData.filter(s => s.departmentId === departmentId);
  }
  const res = await axiosInstance.get(`/sections/${departmentId}`);
  return res.data;
}

export async function createSection(
  section: Omit<Section, "sectionId" | "createdAt" | "updatedAt">
): Promise<Section> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const newSection: Section = {
      ...section,
      sectionId: `sec-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSectionsData.push(newSection);
    return newSection;
  }
  const res = await axiosInstance.post("/sections/create", section);
  return res.data;
}

export async function updateSection(
  sectionId: string,
  section: Partial<Omit<Section, "sectionId" | "createdAt" | "updatedAt">>
): Promise<Section> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockSectionsData.findIndex(s => s.sectionId === sectionId);
    if (index === -1) throw new Error(`Section ${sectionId} not found`);
    mockSectionsData[index] = {
      ...mockSectionsData[index],
      ...section,
      updatedAt: new Date().toISOString(),
    };
    return mockSectionsData[index];
  }
  const res = await axiosInstance.put(`/sections/update/${sectionId}`, section);
  return res.data;
}

export async function deleteSection(sectionId: string): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockSectionsData.findIndex(s => s.sectionId === sectionId);
    if (index === -1) throw new Error(`Section ${sectionId} not found`);
    mockSectionsData.splice(index, 1);
    return;
  }
  await axiosInstance.delete(`/sections/delete/${sectionId}`);
}