


import { createSection, deleteSection, getSections, getSectionsByDepartmentid, Section, updateSection } from "@/services/sectionService";
import { useQuery,
     useMutation,
      useQueryClient 
    } from "@tanstack/react-query";


export function useSections(departmentId?: string) {
  const queryClient = useQueryClient();

  // Fetch all sections
  const sectionQuery = useQuery<Section[]>({
    queryKey: ["sections"],
    queryFn: getSections,
    staleTime: 1000 * 60 * 5, 
  });
//fetch all sections my departmentid
   const sectionQueryByDepartment = useQuery<Section[]>({
      queryKey: ["sections", departmentId],
      queryFn: () => getSectionsByDepartmentid(departmentId!),
      enabled: !!departmentId, 
      staleTime: 1000 * 60 * 5,
    });


    // Create sections
    const createSections = useMutation({
      mutationFn: createSection,
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      },
    });

    //update sections
    const updateSections = useMutation({
      mutationFn: ({ sectionId, section }: { sectionId: string; section: Partial<Section> }) =>
        updateSection(sectionId, section),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sections"] });
      },
    });

     const deleteSections = useMutation({
        mutationFn: deleteSection,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["sections"] });
        },
      });





  return { sectionQuery,
    sectionQueryByDepartment,
    createSections,
    updateSections,
    deleteSections
   
   
     };
}
