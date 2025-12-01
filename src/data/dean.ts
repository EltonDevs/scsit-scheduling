// data/dean.ts
import { User, UserRole } from "@/types/User";

export const deanData: User[] = [
  {
    userId: "1",
    firstName: "Lindsey",
    lastName: "Curtis",
    email: "lindsey@example.com",
    phone: "+63 912 345 6789",
    department: {
      departmentId: "cs-001",
      name: "Computer Science"
    },
    role: "DEAN" as UserRole,
    isActive: true,
    profilePicture: "/images/user/user-17.jpg",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z",
  },
  {
    userId: "2",
    firstName: "Kaiya",
    lastName: "George",
    email: "kaiya@example.com",
    phone: "+63 998 765 4321",
    department: {
      departmentId: "it-001",
      name: "Information Tech"
    },
    role: "DEAN" as UserRole,
    isActive: false,
    profilePicture: "/images/user/user-18.jpg",
    createdAt: "2022-06-10T00:00:00Z",
    updatedAt: "2022-06-10T00:00:00Z",
  },
  {
    userId: "3",
    firstName: "Zain",
    lastName: "Geidt",
    email: "zain@example.com",
    phone: "+63 917 123 4567",
    department: {
      departmentId: "bus-001",
      name: "Business"
    },
    role: "DEAN" as UserRole,
    isActive: true,
    profilePicture: "/images/user/user-19.jpg",
    createdAt: "2021-09-01T00:00:00Z",
    updatedAt: "2021-09-01T00:00:00Z",
  },
  {
    userId: "4",
    firstName: "Abram",
    lastName: "Schleifer",
    email: "abram@example.com",
    phone: null,
    department: {
      departmentId: "eng-001",
      name: "Engineering"
    },
    role: "DEAN" as UserRole,
    isActive: false,
    profilePicture: null,
    createdAt: "2020-03-20T00:00:00Z",
    updatedAt: "2020-03-20T00:00:00Z",
  },
];