// data/teachers.ts
export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  department: string;
  role: string | "teacher";
  is_active: boolean;
  profile_picture: string | null;
  password: string;
  assigned_since: string | null;
}

export const teacherData: Teacher[] = [
  {
    id: "1",
    name: "Lindsey Curtis",
    email: "lindsey@example.com",
    phone_number: "+63 912 345 6789",
    department: "Computer Science",
    role: "teacher",
    is_active: true,
    profile_picture: "/images/user/user-17.jpg",
    password: "hashed_password_1", // In production, passwords should be securely hashed
    assigned_since: "2023-01-15",
  },
  {
    id: "2",
    name: "Kaiya George",
    email: "kaiya@example.com",
    phone_number: "+63 998 765 4321",
    department: "Information Tech",
    role: "teacher",
    is_active: false,
    profile_picture: "/images/user/user-18.jpg",
    password: "hashed_password_2",
    assigned_since: "2022-06-10",
  },
  {
    id: "3",
    name: "Zain Geidt",
    email: "zain@example.com",
    phone_number: "+63 917 123 4567",
    department: "Business",
    role: "teacher",
    is_active: true,
    profile_picture: "/images/user/user-19.jpg",
    password: "hashed_password_3",
    assigned_since: "2021-09-01",
  },
  {
    id: "4",
    name: "Abram Schleifer",
    email: "abram@example.com",
    phone_number: null,
    department: "Engineering",
    role: "teacher",
    is_active: false,
    profile_picture: null,
    password: "hashed_password_4",
    assigned_since: null,
  },
];