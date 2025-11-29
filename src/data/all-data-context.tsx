
// Enum for User roles
export enum Role {
  ADMIN = "ADMIN", // Admin role for system-wide access
  DEAN = "DEAN", // Dean role for department head
  TEACHER = "TEACHER", // Teacher role for section assignments
}

// Interface for Department entity
export interface Department {
  departmentId: number; // Primary key, auto-incremented
  code: string; // Department code, non-nullable, unique
  name: string; // Department name, non-nullable, unique
  description?: string; // Optional description, nullable
  headId?: number; // Foreign key to User.userId (DEAN), nullable
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Interface for User entity
export interface User {
  userId: number; // Primary key, auto-incremented
  firstName: string; // First name, non-nullable
  lastName: string; // Last name, non-nullable
  email: string; // Email address, non-nullable, unique
  role: Role; // User role, non-nullable, from Role enum
  departmentId?: number; // Foreign key to Department.departmentId, nullable
  phone?: string; // Phone number, nullable
  profilePicture?: string; // URL to profile picture, nullable
  isActive?: boolean; // Active status, nullable, defaults to true
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Enum for Course status
export enum CourseStatus {
  ACTIVE = "ACTIVE", // Course is active
  INACTIVE = "INACTIVE", // Course is inactive
}

// Interface for Course entity
export interface Course {
  courseId: string;
  courseCode: string;
  title: string;
  department: Department; // full object, not just ID
  durationYears?: number | null;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Enum for Subject type
export enum SubjectType {
  MAJOR = "MAJOR", // Major subject
  MINOR = "MINOR", // Minor subject
}

// Interface for Subject entity
export interface Subject {
  subjectId: number; // Primary key, auto-incremented
  code: string; // Subject code, non-nullable, unique
  name: string; // Subject name, non-nullable
  description?: string; // Subject description, nullable
  courseId?: number; // Foreign key to Course.courseId, nullable
  departmentId: number; // Foreign key to Department.departmentId, non-nullable
  creditUnits: number; // Credit units, non-nullable, non-negative
  semesterId: number; // Foreign key to Semester.semesterId, non-nullable
  yearLevel: number; // Year level, non-nullable, positive
  type: SubjectType; // Subject type, non-nullable, from SubjectType enum
  isActive?: boolean; // Active status, nullable, defaults to true
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Interface for Semester entity
export interface Semester {
  semesterId: number; // Primary key, auto-incremented
  name: string; // Semester name (e.g., "Fall 2025"), non-nullable
  startDate: string; // Start date, non-nullable, ISO 8601 string
  endDate: string; // End date, non-nullable, ISO 8601 string
  isCurrent?: boolean; // Current semester flag, nullable, defaults to false
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Enum for Section status
export enum SectionStatus {
  ACTIVE = "ACTIVE", // Section is active
  INACTIVE = "INACTIVE", // Section is inactive
}

// Interface for Section entity
export interface Section {
  sectionId: number; // Primary key, auto-incremented
  name: string; // Section name (e.g., "A"), non-nullable
  code: string; // Section code (e.g., "CS101-A"), non-nullable, unique with subjectId and semesterId
  yearLevel: number; // Year level, non-nullable, positive
  semesterId: number; // Foreign key to Semester.semesterId, non-nullable
  courseId: number; // Foreign key to Course.courseId, non-nullable
  subjectId: number; // Foreign key to Subject.subjectId, non-nullable
  teacherId: number; // Foreign key to User.userId (TEACHER), non-nullable
  maxStudents: number; // Maximum students, non-nullable, positive
  status: SectionStatus; // Section status, non-nullable, from SectionStatus enum
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Enum for Room type
export enum RoomType {
  LECTURE = "LECTURE", // Lecture room
  LAB = "LAB", // Laboratory room
  SEMINAR = "SEMINAR", // Seminar room
  AUDITORIUM = "AUDITORIUM", // Auditorium room
}

// Enum for Room status
export enum RoomStatus {
  AVAILABLE = "AVAILABLE", // Room is available for scheduling
  OCCUPIED = "OCCUPIED", // Room is currently occupied
  MAINTENANCE = "MAINTENANCE", // Room is under maintenance
}

// Interface for Room entity
export interface Room {
  roomId: number; // Primary key, auto-incremented
  roomCode: string; // Room code (e.g., "R101"), non-nullable, unique
  name?: string; // Room name (e.g., "Lecture Hall A"), nullable
  capacity: number; // Room capacity, non-nullable, positive
  building?: string; // Building name, nullable
  floor?: string; // Floor number, nullable
  type: RoomType; // Room type, non-nullable, from RoomType enum
  departmentId?: number; // Foreign key to Department.departmentId, nullable
  status: RoomStatus; // Room status, non-nullable, from RoomStatus enum
  isPublic?: boolean; // Public access flag, nullable, defaults to true
  equipment?: string; // Equipment list (e.g., "Projector"), nullable
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Interface for TimeSlot entity
export interface TimeSlot {
  timeSlotId: number; // Primary key, auto-incremented
  startTime: string; // Start time, non-nullable, ISO 8601 time string (e.g., "09:00:00")
  endTime: string; // End time, non-nullable, ISO 8601 time string
  durationMinutes?: number; // Duration in minutes, nullable
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Enum for Day of Week
export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Interface for Schedule entity
export interface Schedule {
  scheduleId: number; // Primary key, auto-incremented
  sectionId: number; // Foreign key to Section.sectionId, non-nullable
  roomId: number; // Foreign key to Room.roomId, non-nullable
  timeSlotId: number; // Foreign key to TimeSlot.timeSlotId, non-nullable
  dayOfWeek: DayOfWeek; // Day of the week, non-nullable, from DayOfWeek enum
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}

// Interface for Prerequisite entity
export interface Prerequisite {
  prerequisiteId: number; // Primary key, auto-incremented
  subjectId: number; // Foreign key to Subject.subjectId, non-nullable
  prerequisiteSubjectId: number; // Foreign key to Subject.subjectId, non-nullable, unique with subjectId
  createdAt?: string; // Creation timestamp, nullable, ISO 8601 string
  updatedAt?: string; // Update timestamp, nullable, ISO 8601 string
}
