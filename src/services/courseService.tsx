// import axiosInstance from "@/utils/axiosInstance";

// export interface Course {
//   courseId: string;
//   courseCode: string;
//   title: string;
//   departmentId: string;
//   departmentName: string;
//   durationYears?: number | null;
//   description?: string | null;
//   status: "ACTIVE" | "INACTIVE";
//   createdAt: string;
//   updatedAt?: string;
// }

// export async function getCourses(): Promise<Course[]> {
//   const res = await axiosInstance.get("/courses");
//   return res.data;
// }

// export async function getCoursesByDepartmentid(departmentId: string): Promise<Course[]> {
//   const res = await axiosInstance.get(`/courses/${departmentId}`);
//   return res.data;
// }

// export async function createCourse(
//   course: Omit<Course, "courseId" | "createdAt" | "updatedAt">
// ): Promise<Course> {
//   const res = await axiosInstance.post("/courses/create", course);
//   return res.data;
// }

// export async function updateCourse(
//   courseId: string,
//   course: Partial<Omit<Course, "courseId" | "createdAt" | "updatedAt">>
// ): Promise<Course> {
//   const res = await axiosInstance.put(`/courses/update/${courseId}`, course);
//   return res.data;
// }

// export async function deleteCourse(courseId: string): Promise<void> {
//   await axiosInstance.delete(`/courses/delete/${courseId}`);
// }



import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockCourses } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";



export interface Course {
  courseId: string;
  courseCode: string;
  title: string;
  departmentId: string;
  departmentName?: string; // Added for display
   durationYears?: number | null;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockCoursesData = [...mockCourses];

export async function getCourses(): Promise<Course[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockCoursesData;
  }
  const res = await axiosInstance.get("/courses");
  return res.data;
}

export async function getCoursesByDepartmentid(departmentId: string): Promise<Course[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockCoursesData.filter(c => c.departmentId === departmentId);
  }
  const res = await axiosInstance.get(`/courses/${departmentId}`);
  return res.data;
}

export async function createCourse(
  course: Omit<Course, "courseId" | "createdAt" | "updatedAt">
): Promise<Course> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const newCourse: Course = {
      ...course,
      courseId: `course-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockCoursesData.push(newCourse);
    return newCourse;
  }
  const res = await axiosInstance.post("/courses/create", course);
  return res.data;
}

export async function updateCourse(
  courseId: string,
  course: Partial<Omit<Course, "courseId" | "createdAt" | "updatedAt">>
): Promise<Course> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockCoursesData.findIndex(c => c.courseId === courseId);
    if (index === -1) throw new Error(`Course ${courseId} not found`);
    mockCoursesData[index] = {
      ...mockCoursesData[index],
      ...course,
      updatedAt: new Date().toISOString(),
    };
    return mockCoursesData[index];
  }
  const res = await axiosInstance.put(`/courses/update/${courseId}`, course);
  return res.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockCoursesData.findIndex(c => c.courseId === courseId);
    if (index === -1) throw new Error(`Course ${courseId} not found`);
    mockCoursesData.splice(index, 1);
    return;
  }
  await axiosInstance.delete(`/courses/delete/${courseId}`);
}