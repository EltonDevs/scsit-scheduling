import api from "@/utils/axiosInstance";

export interface Department {
  departmentId: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "INACTIVE";
}

export async function getDepartments(): Promise<Department[]> {
  const res = await api.get("/departments");
  return res.data;
}

export async function getDepartmentById(id: string): Promise<Department> {
  const res = await api.get(`/departments/${id}`);
  return res.data;
}

export async function createDepartment(
  dept: Omit<Department, "departmentId" | "createdAt" | "updatedAt">
): Promise<Department> {
  const res = await api.post("/departments/create", dept);
  return res.data;
}

export async function updateDepartment(
  departmentId: string,
  dept: Partial<Omit<Department, "departmentId" | "createdAt" | "updatedAt">>
): Promise<Department> {
  const res = await api.put(`/departments/update/${departmentId}`, dept);
  return res.data;
}

export async function deleteDepartment(departmentId: string): Promise<void> {
  await api.delete(`/departments/delete/${departmentId}`);
}
