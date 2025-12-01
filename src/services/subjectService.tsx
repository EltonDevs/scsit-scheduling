// import axiosInstance from "@/utils/axiosInstance";




// export interface Subject{
//   subjectId: string;
//   code: string;
//   name: string;
//   description: string;
//   courseId: string;
//   courseTitle: string;
//   creditUnits: number;
//   semesterId: string;
//   semesterName: string;
//   yearLevel: number;
//   type: string;
//   isShared: boolean;
//   isActive: boolean;
//   createdAt: string; // ISO date string from LocalDateTime
//   updatedAt: string; // ISO date string from LocalDateTime
// }


// export async function getSubjects(): Promise<Subject[]> {
//   const res = await axiosInstance.get("/subjects");
//   return res.data;
// }


// export async function getSubjectByDepartmentId(departmentId: string): Promise<Subject[]> {
//   const res = await axiosInstance.get(`/subjects/${departmentId}`);
//   return res.data;
// }


// export async function createSubjects(
//   subject: Omit<Subject, "subjectId" | "createdAt" | "updatedAt">
// ): Promise<Subject> {
//   const res = await axiosInstance.post("/subjects/create", subject);
//   return res.data;
// }

// export async function updateSubjects(
//   subjectId: string,
//   subject: Partial<Omit<Subject, "subjectId" | "createdAt" | "updatedAt">>
// ): Promise<Subject> {
//   const res = await axiosInstance.put(`/subjects/update/${subjectId}`, subject);
//   return res.data;
// }

// export async function deleteSubjects(subjectId: string): Promise<void> {
//   await axiosInstance.delete(`/subjects/delete/${subjectId}`);
// }


import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockSubjects } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

export interface Subject {
  subjectId: string;
  code: string;
  name: string;
  description?: string;
  courseId: string;
  courseTitle?: string;
  creditUnits: number;
  semesterId: string;
  semesterName?: string;
  headId?: string;
  yearLevel: number;
  type: string;
  isShared: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockSubjectsData = [...mockSubjects];

export async function getSubjects(): Promise<Subject[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockSubjectsData;
  }
  const res = await axiosInstance.get("/subjects");
  return res.data;
}

export async function getSubjectByDepartmentId(departmentId: string): Promise<Subject[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    // Note: Mock subjects don't have departmentId directly,
    // you'd need to filter through courses if needed in real implementation
    return mockSubjectsData;
  }
  const res = await axiosInstance.get(`/subjects/${departmentId}`);
  return res.data;
}

export async function createSubjects(
  subject: Omit<Subject, "subjectId" | "createdAt" | "updatedAt">
): Promise<Subject> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const newSubject: Subject = {
      ...subject,
      subjectId: `subj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSubjectsData.push(newSubject);
    return newSubject;
  }
  const res = await axiosInstance.post("/subjects/create", subject);
  return res.data;
}

export async function updateSubjects(
  subjectId: string,
  subject: Partial<Omit<Subject, "subjectId" | "createdAt" | "updatedAt">>
): Promise<Subject> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockSubjectsData.findIndex(s => s.subjectId === subjectId);
    if (index === -1) throw new Error(`Subject ${subjectId} not found`);
    mockSubjectsData[index] = {
      ...mockSubjectsData[index],
      ...subject,
      updatedAt: new Date().toISOString(),
    };
    return mockSubjectsData[index];
  }
  const res = await axiosInstance.put(`/subjects/update/${subjectId}`, subject);
  return res.data;
}

export async function deleteSubjects(subjectId: string): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockSubjectsData.findIndex(s => s.subjectId === subjectId);
    if (index === -1) throw new Error(`Subject ${subjectId} not found`);
    mockSubjectsData.splice(index, 1);
    return;
  }
  await axiosInstance.delete(`/subjects/delete/${subjectId}`);
}