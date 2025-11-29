// hooks/useDepartments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
    Department,
} from "@/services/departmentService";

export function useDepartments() {
  const queryClient = useQueryClient();

  // Fetch all departments
  const departmentsQuery = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: getDepartments,
    staleTime: 1000 * 60 * 5, 
  });

  // Create department
  const createDept = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  // Update department
  const updateDept = useMutation({
    mutationFn: ({ departmentId, dept }: { departmentId: string; dept: Partial<Department> }) =>
      updateDepartment(departmentId, dept),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  // Delete department
  const deleteDept = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["departments"] }),
  });

  return { departmentsQuery, createDept, updateDept, deleteDept };
}
