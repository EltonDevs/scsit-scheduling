// import api from "@/utils/axiosInstance";

// export interface Department {
//   departmentId: string;
//   code: string;
//   name: string;
//   description?: string;
//   createdAt: string;
//   updatedAt: string;
//   status: "ACTIVE" | "INACTIVE";
// }

// export async function getDepartments(): Promise<Department[]> {
//   const res = await api.get("/departments");
//   return res.data;
// }

// export async function getDepartmentById(id: string): Promise<Department> {
//   const res = await api.get(`/departments/${id}`);
//   return res.data;
// }

// export async function createDepartment(
//   dept: Omit<Department, "departmentId" | "createdAt" | "updatedAt">
// ): Promise<Department> {
//   const res = await api.post("/departments/create", dept);
//   return res.data;
// }

// export async function updateDepartment(
//   departmentId: string,
//   dept: Partial<Omit<Department, "departmentId" | "createdAt" | "updatedAt">>
// ): Promise<Department> {
//   const res = await api.put(`/departments/update/${departmentId}`, dept);
//   return res.data;
// }

// export async function deleteDepartment(departmentId: string): Promise<void> {
//   await api.delete(`/departments/delete/${departmentId}`);
// }


import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockDepartments } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

export interface Department {
  departmentId: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted? : boolean;
  status: "ACTIVE" | "INACTIVE";
}

const mockDepartmentsData = [...mockDepartments];

export async function getDepartments(): Promise<Department[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockDepartmentsData;
  }
  const res = await axiosInstance.get("/departments");
  return res.data;
}

export async function getDepartmentById(id: string): Promise<Department> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    const dept = mockDepartmentsData.find(d => d.departmentId === id);
    if (!dept) throw new Error(`Department ${id} not found`);
    return dept;
  }
  const res = await axiosInstance.get(`/departments/${id}`);
  return res.data;
}

export async function createDepartment(
  dept: Omit<Department, "departmentId" | "createdAt" | "updatedAt">
): Promise<Department> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const newDept: Department = {
      ...dept,
      departmentId: `dept-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDepartmentsData.push(newDept);
    return newDept;
  }
  const res = await axiosInstance.post("/departments/create", dept);
  return res.data;
}

export async function updateDepartment(
  departmentId: string,
  dept: Partial<Omit<Department, "departmentId" | "createdAt" | "updatedAt">>
): Promise<Department> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockDepartmentsData.findIndex(d => d.departmentId === departmentId);
    if (index === -1) throw new Error(`Department ${departmentId} not found`);
    mockDepartmentsData[index] = {
      ...mockDepartmentsData[index],
      ...dept,
      updatedAt: new Date().toISOString(),
    };
    return mockDepartmentsData[index];
  }
  const res = await axiosInstance.put(`/departments/update/${departmentId}`, dept);
  return res.data;
}

export async function deleteDepartment(departmentId: string): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockDepartmentsData.findIndex(d => d.departmentId === departmentId);
    if (index === -1) throw new Error(`Department ${departmentId} not found`);
    mockDepartmentsData.splice(index, 1);
    return;
  }
  await axiosInstance.delete(`/departments/delete/${departmentId}`);
}
