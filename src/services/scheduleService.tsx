// /* eslint-disable @typescript-eslint/no-explicit-any */
// import axiosInstance from "@/utils/axiosInstance";

// export interface Schedule {
//   scheduleId: string;
//   subjectId: string;
//   subjectName?: string;
//   teacherId: string;
//   teacherName?: string;
//   roomId: string;
//   roomName?: string;
//   sectionId: string;
//   sectionName?: string;
//   dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
//   startTime: string; // "HH:mm:ss"
//   endTime: string;   // "HH:mm:ss"
//   createdAt: string;
//   updatedAt?: string;
// }

// //  Helper function to extract error messages
// function extractErrorMessage(error: any): string {
//   if (error.response) {
//     const errorData = error.response.data;
    
//     if (typeof errorData === 'string') {
//       return errorData;
//     } else if (errorData?.error) {
//       return errorData.error;
//     } else if (errorData?.message) {
//       return errorData.message;
//     }
//   }
  
//   return error.message || "An unexpected error occurred.";
// }

// export async function getSchedules(): Promise<Schedule[]> {
//   const res = await axiosInstance.get("/schedules");
//   return res.data;
// }

// export async function getSchedulesByDepartmentid(departmentId: string): Promise<Schedule[]> {
//   const res = await axiosInstance.get(`/schedules/${departmentId}`);
//   return res.data;
// }

// export async function getScheduleById(scheduleId: string): Promise<Schedule> {
//   const res = await axiosInstance.get(`/schedules/${scheduleId}`);
//   return res.data;
// }

// // Create with proper error handling
// export async function createSchedule(
//   schedule: Omit<Schedule, "scheduleId" | "createdAt" | "updatedAt">
// ): Promise<Schedule> {
//   try {
//     const res = await axiosInstance.post("/schedules/create", schedule);
//     return res.data;
//   } catch (error: any) {
//     throw new Error(extractErrorMessage(error));
//   }
// }

// //  Update with proper error handling
// export async function updateSchedule(
//   scheduleId: string,
//   schedule: Partial<Omit<Schedule, "scheduleId" | "createdAt" | "updatedAt">>
// ): Promise<Schedule> {
//   try {
//     const res = await axiosInstance.put(`/schedules/update/${scheduleId}`, schedule);
//     return res.data;
//   } catch (error: any) {
//     throw new Error(extractErrorMessage(error));
//   }
// }

// // Delete with proper error handling
// export async function deleteSchedule(scheduleId: string): Promise<void> {
//   try {
//     await axiosInstance.delete(`/schedules/delete/${scheduleId}`);
//   } catch (error: any) {
//     throw new Error(extractErrorMessage(error));
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockSchedules } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

export interface Schedule {
  scheduleId: string;
  subjectId: string;
  sectionId: string;
  roomId: string;
  teacherId: string;
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  // isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockSchedulesData = [...mockSchedules];

// Helper function to extract error messages
function extractErrorMessage(error: any): string {
  if (error.response) {
    const errorData = error.response.data;
    
    if (typeof errorData === 'string') {
      return errorData;
    } else if (errorData?.error) {
      return errorData.error;
    } else if (errorData?.message) {
      return errorData.message;
    }
  }
  
  return error.message || "An unexpected error occurred.";
}

export async function getSchedules(): Promise<Schedule[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockSchedulesData;
  }
  const res = await axiosInstance.get("/schedules");
  return res.data;
}

export async function getSchedulesByDepartmentid(departmentId: string): Promise<Schedule[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    // Note: Mock schedules don't have departmentId, so this would need to be 
    // filtered through sections or subjects if needed in your real implementation
    return mockSchedulesData;
  }
  const res = await axiosInstance.get(`/schedules/${departmentId}`);
  return res.data;
}

export async function getScheduleById(scheduleId: string): Promise<Schedule> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(300);
    const schedule = mockSchedulesData.find(s => s.scheduleId === scheduleId);
    if (!schedule) throw new Error(`Schedule ${scheduleId} not found`);
    return schedule;
  }
  const res = await axiosInstance.get(`/schedules/${scheduleId}`);
  return res.data;
}

// Create with proper error handling
export async function createSchedule(
  schedule: Omit<Schedule, "scheduleId" | "createdAt" | "updatedAt">
): Promise<Schedule> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    try {
      await delay(MOCK_CONFIG.MOCK_DELAY);
      const newSchedule: Schedule = {
        ...schedule,
        scheduleId: `sched-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
   
      };
      mockSchedulesData.push(newSchedule);
      return newSchedule;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  }
  try {
    const res = await axiosInstance.post("/schedules/create", schedule);
    return res.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

// Update with proper error handling
export async function updateSchedule(
  scheduleId: string,
  schedule: Partial<Omit<Schedule, "scheduleId" | "createdAt" | "updatedAt">>
): Promise<Schedule> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    try {
      await delay(MOCK_CONFIG.MOCK_DELAY);
      const index = mockSchedulesData.findIndex(s => s.scheduleId === scheduleId);
      if (index === -1) throw new Error(`Schedule ${scheduleId} not found`);
      mockSchedulesData[index] = {
        ...mockSchedulesData[index],
        ...schedule,
        updatedAt: new Date().toISOString(),
      };
      return mockSchedulesData[index];
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  }
  try {
    const res = await axiosInstance.put(`/schedules/update/${scheduleId}`, schedule);
    return res.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

// Delete with proper error handling
export async function deleteSchedule(scheduleId: string): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    try {
      await delay(MOCK_CONFIG.MOCK_DELAY);
      const index = mockSchedulesData.findIndex(s => s.scheduleId === scheduleId);
      if (index === -1) throw new Error(`Schedule ${scheduleId} not found`);
      mockSchedulesData.splice(index, 1);
      return;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  }
  try {
    await axiosInstance.delete(`/schedules/delete/${scheduleId}`);
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}