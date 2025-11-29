// hooks/useDepartments.ts

import { Dean, getDeans } from "@/services/deanService";
import { useQuery} from "@tanstack/react-query";


export function useDeans() {
//   const queryClient = useQueryClient();

  // Fetch all courses
  const deanQuery = useQuery<Dean[]>({
    queryKey: ["deans"],
    queryFn: getDeans,
    staleTime: 1000 * 60 * 5, 
  });

  return { deanQuery };
}
