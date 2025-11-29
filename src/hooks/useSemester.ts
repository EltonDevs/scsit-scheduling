

import { getSemester, Semester } from "@/services/semesterService";

import { useQuery} from "@tanstack/react-query";


export function useSemester() {
//   const queryClient = useQueryClient();

  // Fetch all courses
  const semesterQuery = useQuery<Semester[]>({
    queryKey: ["semesters"],
    queryFn: getSemester,
    staleTime: 1000 * 60 * 5, 
  });

  return { semesterQuery };
}
