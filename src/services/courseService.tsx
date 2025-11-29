import axiosInstance from "@/utils/axiosInstance";

export interface Course {
  courseId: string;
  courseCode: string;
  title: string;
  departmentId: string;
  departmentName: string;
  durationYears?: number | null;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt?: string;
}

export async function getCourses(): Promise<Course[]> {
  const res = await axiosInstance.get("/courses");
  return res.data;
}

export async function getCoursesByDepartmentid(departmentId: string): Promise<Course[]> {
  const res = await axiosInstance.get(`/courses/${departmentId}`);
  return res.data;
}

export async function createCourse(
  course: Omit<Course, "courseId" | "createdAt" | "updatedAt">
): Promise<Course> {
  const res = await axiosInstance.post("/courses/create", course);
  return res.data;
}

export async function updateCourse(
  courseId: string,
  course: Partial<Omit<Course, "courseId" | "createdAt" | "updatedAt">>
): Promise<Course> {
  const res = await axiosInstance.put(`/courses/update/${courseId}`, course);
  return res.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await axiosInstance.delete(`/courses/delete/${courseId}`);
}
