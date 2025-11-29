import axiosInstance from "@/utils/axiosInstance";




export interface Subject{
  subjectId: string;
  code: string;
  name: string;
  description: string;
  courseId: string;
  courseTitle: string;
  creditUnits: number;
  semesterId: string;
  semesterName: string;
  yearLevel: number;
  type: string;
  isShared: boolean;
  isActive: boolean;
  createdAt: string; // ISO date string from LocalDateTime
  updatedAt: string; // ISO date string from LocalDateTime
}


export async function getSubjects(): Promise<Subject[]> {
  const res = await axiosInstance.get("/subjects");
  return res.data;
}


export async function getSubjectByDepartmentId(departmentId: string): Promise<Subject[]> {
  const res = await axiosInstance.get(`/subjects/${departmentId}`);
  return res.data;
}


export async function createSubjects(
  subject: Omit<Subject, "subjectId" | "createdAt" | "updatedAt">
): Promise<Subject> {
  const res = await axiosInstance.post("/subjects/create", subject);
  return res.data;
}

export async function updateSubjects(
  subjectId: string,
  subject: Partial<Omit<Subject, "subjectId" | "createdAt" | "updatedAt">>
): Promise<Subject> {
  const res = await axiosInstance.put(`/subjects/update/${subjectId}`, subject);
  return res.data;
}

export async function deleteSubjects(subjectId: string): Promise<void> {
  await axiosInstance.delete(`/subjects/delete/${subjectId}`);
}
