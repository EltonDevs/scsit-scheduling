// src/types/Schedule.ts
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface Schedule {
  scheduleId: string;                    // <-- Added
  subjectId: string;
  subjectName?: string;
  teacherId: string;
  teacherName?: string;
  roomId: string;
  roomName?: string;
  sectionId: string;
  sectionName?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm:ss"
  endTime: string;   // "HH:mm:ss"
  createdAt: string;
  updatedAt?: string;
}