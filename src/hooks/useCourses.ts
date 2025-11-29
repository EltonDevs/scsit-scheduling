// hooks/useCourses.ts
import { Course, createCourse, deleteCourse, getCourses, getCoursesByDepartmentid, updateCourse } from "@/services/courseService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCourses(departmentId?: string) {
  const queryClient = useQueryClient();

  // Fetch courses (all or by departmentId)
  const courseQuery = useQuery<Course[]>({
    queryKey: departmentId ? ["courses", departmentId] : ["courses"],
    queryFn: () =>
      departmentId ? getCoursesByDepartmentid(departmentId) : getCourses(),
    staleTime: 1000 * 60 * 5,
  });

  // Create course
  const createCourses = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Update course
  const updateCourses = useMutation({
    mutationFn: ({ courseId, course }: { courseId: string; course: Partial<Course> }) =>
      updateCourse(courseId, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  // Delete course
  const deleteCourses = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return { courseQuery, createCourses, updateCourses, deleteCourses };
}
