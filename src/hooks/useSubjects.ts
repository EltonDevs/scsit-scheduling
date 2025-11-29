

import { createSubjects, deleteSubjects, getSubjectByDepartmentId, getSubjects, Subject, updateSubjects } from "@/services/subjectService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export function useSubjects(departmentId?: string) {
  const queryClient = useQueryClient();

  // Fetch all subjects
  const subjectQuery = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: 1000 * 60 * 5, 
  });

  //fetch all subjects my departmentid
     const subjectQueryByDepartmentId = useQuery<Subject[]>({
        queryKey: ["subjects", departmentId],
        queryFn: () => getSubjectByDepartmentId(departmentId!),
        enabled: !!departmentId, 
        staleTime: 1000 * 60 * 5,
      });
    

  // Create subjects
  const createSubject = useMutation({
    mutationFn: createSubjects,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["subjects"] }),
  });


  //Update subjects
  const updateSubject = useMutation({
    mutationFn: ({ subjectId, subject }: { subjectId: string; subject: Partial<Subject> }) =>
      updateSubjects(subjectId, subject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });


  //Delete subjects
    const deleteSubject = useMutation({
      mutationFn: deleteSubjects,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
      },
    });
  




  return { subjectQuery,
     createSubject, 
     subjectQueryByDepartmentId,
     updateSubject, 
     deleteSubject,
    //  deleteCourses
     };
}
