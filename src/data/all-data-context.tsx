// ============================================
// types/models.ts - All TypeScript Interfaces
// ============================================

export interface Department {
  departmentId: string;
  code: string;
  name: string;
  description?: string;
  headId?: string;
  headName?: string; // Added for display
  status: "ACTIVE" | "INACTIVE";
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export interface Room {
  roomId: string;
  roomCode: string;
  name: string;
  capacity: number;
  building: string;
  floor: string;
  type: "LECTURE" | "LAB" | "SEMINAR" | "AUDITORIUM";
  departmentId?: string;
  departmentName?: string; // Added for display
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  isPublic: boolean;
  equipment?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  semesterId: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}




export interface Section {
  departmentId: string;
  departmentName?: string;
  sectionId: string;
  name: string;
  code: string;
  yearLevel: number;
  semesterId: string;
  semesterName: string;
  courseId: string;
  courseTitle: string;
  isDeleted? : boolean;
  maxStudents: number;
  status: string;
  createdAt: string; // ISO date string (from LocalDateTime)
  updatedAt: string; // ISO date string (from LocalDateTime)
}

export interface Subject {
  subjectId: string;
  code: string;
  name: string;
  description?: string;
  courseId: string;
  courseTitle?: string; // Added for display
  creditUnits: number;
  semesterId: string;
  semesterName?: string; // Added for display
  headId?: string;
  headName?: string; // Added for display (teacher name)
  yearLevel: number;
  type: string;
  isShared: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ROLE_ADMIN" | "ROLE_DEAN" | "ROLE_TEACHER";
  departmentId?: string;
  departmentName?: string; // Added for display
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  scheduleId: string;
  subjectId: string;
  subjectName?: string; // Added for display
  sectionId: string;
  sectionName?: string; // Added for display
  roomId: string;
  roomName?: string; // Added for display
  teacherId: string;
  teacherName?: string; // Added for display
  dayOfWeek: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY";
  startTime: string;
  endTime: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// data/mockData.ts - All Mock Data
// ============================================

// Departments
export const mockDepartments: Department[] = [
  {
    departmentId: "dept-001",
    code: "CS",
    name: "Computer Science",
    description: "Department of Computer Science and Information Technology",
    headId: "user-dean-001",
    headName: "Lindsey Curtis",
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2023-01-15T08:00:00Z",
  },
  {
    departmentId: "dept-002",
    code: "IT",
    name: "Information Technology",
    description: "Department of Information Technology",
    headId: "user-dean-002",
    headName: "Kaiya George",
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2022-06-10T08:00:00Z",
    updatedAt: "2023-03-20T08:00:00Z",
  },
  {
    departmentId: "dept-003",
    code: "ENGR",
    name: "Engineering",
    description: "Department of Engineering",
    headId: "user-dean-003",
    headName: "Zain Geidt",
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2021-09-01T08:00:00Z",
    updatedAt: "2023-05-15T08:00:00Z",
  },
  {
    departmentId: "dept-004",
    code: "BUS",
    name: "Business Administration",
    description: "Department of Business and Management",
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2020-03-20T08:00:00Z",
    updatedAt: "2023-08-10T08:00:00Z",
  },
];

// Users (Admins, Deans, Teachers)
export const mockUsers: User[] = [
  // Admin
  {
    userId: "user-admin-001",
    firstName: "John",
    lastName: "Admin",
    email: "admin@school.edu",
    role: "ROLE_ADMIN",
    phone: "+63 917 123 4567",
    isActive: true,
    createdAt: "2023-01-01T08:00:00Z",
    updatedAt: "2023-01-01T08:00:00Z",
  },
  // Deans
  {
    userId: "user-dean-001",
    firstName: "Lindsey",
    lastName: "Curtis",
    email: "lindsey.curtis@school.edu",
    role: "ROLE_DEAN",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    phone: "+63 912 345 6789",
    isActive: true,
    createdAt: "2023-01-15T08:00:00Z",
    updatedAt: "2023-01-15T08:00:00Z",
  },
  {
    userId: "user-dean-002",
    firstName: "Kaiya",
    lastName: "George",
    email: "kaiya.george@school.edu",
    role: "ROLE_DEAN",
    departmentId: "dept-002",
    departmentName: "Information Technology",
    phone: "+63 998 765 4321",
    isActive: true,
    createdAt: "2022-06-10T08:00:00Z",
    updatedAt: "2023-03-20T08:00:00Z",
  },
  {
    userId: "user-dean-003",
    firstName: "Zain",
    lastName: "Geidt",
    email: "zain.geidt@school.edu",
    role: "ROLE_DEAN",
    departmentId: "dept-003",
    departmentName: "Engineering",
    phone: "+63 917 123 4567",
    isActive: true,
    createdAt: "2021-09-01T08:00:00Z",
    updatedAt: "2023-05-15T08:00:00Z",
  },
  // Teachers
  {
    userId: "user-teacher-001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@school.edu",
    role: "ROLE_TEACHER",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    phone: "+63 919 876 5432",
    isActive: true,
    createdAt: "2023-02-01T08:00:00Z",
    updatedAt: "2023-02-01T08:00:00Z",
  },
  {
    userId: "user-teacher-002",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@school.edu",
    role: "ROLE_TEACHER",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    phone: "+63 920 111 2222",
    isActive: true,
    createdAt: "2023-02-15T08:00:00Z",
    updatedAt: "2023-02-15T08:00:00Z",
  },
  {
    userId: "user-teacher-003",
    firstName: "Emma",
    lastName: "Rodriguez",
    email: "emma.rodriguez@school.edu",
    role: "ROLE_TEACHER",
    departmentId: "dept-002",
    departmentName: "Information Technology",
    phone: "+63 921 333 4444",
    isActive: true,
    createdAt: "2023-03-01T08:00:00Z",
    updatedAt: "2023-03-01T08:00:00Z",
  },
  {
    userId: "user-teacher-004",
    firstName: "James",
    lastName: "Williams",
    email: "james.williams@school.edu",
    role: "ROLE_TEACHER",
    departmentId: "dept-003",
    departmentName: "Engineering",
    phone: "+63 922 555 6666",
    isActive: true,
    createdAt: "2023-03-15T08:00:00Z",
    updatedAt: "2023-03-15T08:00:00Z",
  },
];

// Courses
export const mockCourses: Course[] = [
  {
    courseId: "course-001",
    courseCode: "BSCS",
    title: "Bachelor of Science in Computer Science",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    durationYears: 4,
    description: "A comprehensive program in computer science fundamentals and applications",
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2023-01-20T08:00:00Z",
    updatedAt: "2023-01-20T08:00:00Z",
  },
  {
    courseId: "course-002",
    courseCode: "BSIT",
    title: "Bachelor of Science in Information Technology",
    departmentId: "dept-002",
    departmentName: "Information Technology",
    durationYears: 4,
    description: "Focus on IT infrastructure, systems, and network management",
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2023-01-20T08:00:00Z",
    updatedAt: "2023-01-20T08:00:00Z",
  },
  {
    courseId: "course-003",
    courseCode: "BSECE",
    title: "Bachelor of Science in Electronics and Communications Engineering",
    departmentId: "dept-003",
    departmentName: "Engineering",
    durationYears: 5,
    description: "Engineering program focusing on electronics and communications",
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2023-01-20T08:00:00Z",
    updatedAt: "2023-01-20T08:00:00Z",
  },
];

// Semesters
export const mockSemesters: Semester[] = [
  {
    semesterId: "sem-001",
    name: "First Semester 2024-2025",
    startDate: "2024-08-01",
    endDate: "2024-12-20",
    isCurrent: false,
    createdAt: "2024-07-01T08:00:00Z",
    updatedAt: "2024-07-01T08:00:00Z",
  },
  {
    semesterId: "sem-002",
    name: "Second Semester 2024-2025",
    startDate: "2025-01-06",
    endDate: "2025-05-30",
    isCurrent: true,
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
];

// Rooms
export const mockRooms: Room[] = [
  {
    roomId: "room-001",
    roomCode: "CS-401",
    name: "Computer Laboratory 1",
    capacity: 40,
    building: "Science Building",
    floor: "4th Floor",
    type: "LAB",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    status: "AVAILABLE",
    isPublic: false,
    equipment: "40 Desktop Computers, Projector, Whiteboard",
    isDeleted: false,
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2023-01-10T08:00:00Z",
  },
  {
    roomId: "room-002",
    roomCode: "CS-301",
    name: "Lecture Room 1",
    capacity: 50,
    building: "Science Building",
    floor: "3rd Floor",
    type: "LECTURE",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    status: "AVAILABLE",
    isPublic: false,
    equipment: "Projector, Whiteboard, Sound System",
    isDeleted: false,
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2023-01-10T08:00:00Z",
  },
  {
    roomId: "room-003",
    roomCode: "IT-501",
    name: "Network Laboratory",
    capacity: 35,
    building: "IT Building",
    floor: "5th Floor",
    type: "LAB",
    departmentId: "dept-002",
    departmentName: "Information Technology",
    status: "AVAILABLE",
    isPublic: false,
    equipment: "35 Workstations, Network Equipment, Server Racks",
    isDeleted: false,
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2023-01-10T08:00:00Z",
  },
  {
    roomId: "room-004",
    roomCode: "AUD-001",
    name: "Main Auditorium",
    capacity: 200,
    building: "Main Building",
    floor: "Ground Floor",
    type: "AUDITORIUM",
    status: "AVAILABLE",
    isPublic: true,
    equipment: "Stage, Sound System, Projector, Lighting",
    isDeleted: false,
    createdAt: "2023-01-10T08:00:00Z",
    updatedAt: "2023-01-10T08:00:00Z",
  },
];

// Sections
export const mockSections: Section[] = [
  {
    sectionId: "sec-001",
    name: "CS 3-A",
    code: "CS3A",
    yearLevel: 3,
    semesterId: "sem-002",
    semesterName: "Second Semester 2024-2025",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    courseId: "course-001",
    courseTitle: "Bachelor of Science in Computer Science",
    maxStudents: 40,
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2024-12-15T08:00:00Z",
    updatedAt: "2024-12-15T08:00:00Z",
  },
  {
    sectionId: "sec-002",
    name: "CS 3-B",
    code: "CS3B",
    yearLevel: 3,
    semesterId: "sem-002",
    semesterName: "Second Semester 2024-2025",
    departmentId: "dept-001",
    departmentName: "Computer Science",
    courseId: "course-001",
    courseTitle: "Bachelor of Science in Computer Science",
    maxStudents: 40,
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2024-12-15T08:00:00Z",
    updatedAt: "2024-12-15T08:00:00Z",
  },
  {
    sectionId: "sec-003",
    name: "IT 2-A",
    code: "IT2A",
    yearLevel: 2,
    semesterId: "sem-002",
    semesterName: "Second Semester 2024-2025",
    departmentId: "dept-002",
    departmentName: "Information Technology",
    courseId: "course-002",
    courseTitle: "Bachelor of Science in Information Technology",
    maxStudents: 35,
    status: "ACTIVE",
    isDeleted: false,
    createdAt: "2024-12-15T08:00:00Z",
    updatedAt: "2024-12-15T08:00:00Z",
  },
];

// Subjects
export const mockSubjects: Subject[] = [
  {
    subjectId: "subj-001",
    code: "CS301",
    name: "Data Structures and Algorithms",
    description: "Study of fundamental data structures and algorithmic techniques",
    courseId: "course-001",
    courseTitle: "Bachelor of Science in Computer Science",
    creditUnits: 3,
    semesterId: "sem-002",
    semesterName: "Second Semester 2024-2025",
    headId: "user-teacher-001",
    headName: "Sarah Johnson",
    yearLevel: 3,
    type: "MAJOR",
    isShared: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
  {
    subjectId: "subj-002",
    code: "CS302",
    name: "Database Management Systems",
    description: "Principles of database design, implementation, and management",
    courseId: "course-001",
    courseTitle: "Bachelor of Science in Computer Science",
    creditUnits: 3,
    semesterId: "sem-002",
    semesterName: "Second Semester 2024-2025",
    headId: "user-teacher-002",
    headName: "Michael Chen",
    yearLevel: 3,
    type: "MAJOR",
    isShared: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
  {
    subjectId: "subj-003",
    code: "CS303L",
    name: "Database Laboratory",
    description: "Hands-on practice with database systems",
    courseId: "course-001",
    courseTitle: "Bachelor of Science in Computer Science",
    creditUnits: 1,
    semesterId: "sem-002",
    semesterName: "Second Semester 2024-2025",
    headId: "user-teacher-002",
    headName: "Michael Chen",
    yearLevel: 3,
    type: "LAB",
    isShared: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
  {
    subjectId: "subj-004",
    code: "IT201",
    name: "Network Fundamentals",
    description: "Introduction to computer networks and protocols",
    courseId: "course-002",
    courseTitle: "Bachelor of Science in Information Technology",
    creditUnits: 3,
    semesterId: "sem-002",
    semesterName: "Second Semester 2024-2025",
    headId: "user-teacher-003",
    headName: "Emma Rodriguez",
    yearLevel: 2,
    type: "MAJOR",
    isShared: false,
    isActive: true,
    isDeleted: false,
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-01T08:00:00Z",
  },
];

// Schedules
export const mockSchedules: Schedule[] = [
  {
    scheduleId: "sched-001",
    subjectId: "subj-001",
    subjectName: "Data Structures and Algorithms",
    sectionId: "sec-001",
    sectionName: "CS 3-A",
    roomId: "room-002",
    roomName: "Lecture Room 1",
    teacherId: "user-teacher-001",
    teacherName: "Sarah Johnson",
    dayOfWeek: "MONDAY",
    startTime: "08:00",
    endTime: "11:00",
    isDeleted: false,
    createdAt: "2025-01-02T08:00:00Z",
    updatedAt: "2025-01-02T08:00:00Z",
  },
  {
    scheduleId: "sched-002",
    subjectId: "subj-001",
    subjectName: "Data Structures and Algorithms",
    sectionId: "sec-001",
    sectionName: "CS 3-A",
    roomId: "room-002",
    roomName: "Lecture Room 1",
    teacherId: "user-teacher-001",
    teacherName: "Sarah Johnson",
    dayOfWeek: "WEDNESDAY",
    startTime: "08:00",
    endTime: "11:00",
    isDeleted: false,
    createdAt: "2025-01-02T08:00:00Z",
    updatedAt: "2025-01-02T08:00:00Z",
  },
  {
    scheduleId: "sched-003",
    subjectId: "subj-002",
    subjectName: "Database Management Systems",
    sectionId: "sec-001",
    sectionName: "CS 3-A",
    roomId: "room-002",
    roomName: "Lecture Room 1",
    teacherId: "user-teacher-002",
    teacherName: "Michael Chen",
    dayOfWeek: "TUESDAY",
    startTime: "13:00",
    endTime: "16:00",
    isDeleted: false,
    createdAt: "2025-01-02T08:00:00Z",
    updatedAt: "2025-01-02T08:00:00Z",
  },
  {
    scheduleId: "sched-004",
    subjectId: "subj-003",
    subjectName: "Database Laboratory",
    sectionId: "sec-001",
    sectionName: "CS 3-A",
    roomId: "room-001",
    roomName: "Computer Laboratory 1",
    teacherId: "user-teacher-002",
    teacherName: "Michael Chen",
    dayOfWeek: "THURSDAY",
    startTime: "13:00",
    endTime: "16:00",
    isDeleted: false,
    createdAt: "2025-01-02T08:00:00Z",
    updatedAt: "2025-01-02T08:00:00Z",
  },
  {
    scheduleId: "sched-005",
    subjectId: "subj-004",
    subjectName: "Network Fundamentals",
    sectionId: "sec-003",
    sectionName: "IT 2-A",
    roomId: "room-003",
    roomName: "Network Laboratory",
    teacherId: "user-teacher-003",
    teacherName: "Emma Rodriguez",
    dayOfWeek: "MONDAY",
    startTime: "13:00",
    endTime: "16:00",
    isDeleted: false,
    createdAt: "2025-01-02T08:00:00Z",
    updatedAt: "2025-01-02T08:00:00Z",
  },
];