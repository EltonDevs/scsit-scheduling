// hooks/useDepartments.ts


import { getteachers, Teacher } from "@/services/teacherService";
import { useQuery} from "@tanstack/react-query";


export function useTeachers() {
//   const queryClient = useQueryClient();

  // Fetch all courses
  const teacherQuery = useQuery<Teacher[]>({
    queryKey: ["teachers"],
    queryFn: getteachers,
    staleTime: 1000 * 60 * 5, 
  });

  return { teacherQuery };
}
