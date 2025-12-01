export type UserRole = "ROLE_ADMIN" | "ROLE_DEAN" | "ROLE_TEACHER";

export interface Department {
departmentId: string;
name: string;
}

export interface User {
userId: string;
firstName: string;
lastName: string;
email: string;
role: UserRole;
department?: Department | null;
phone?: string | null;
profilePicture ? : string | null,
isActive: boolean;
createdAt: string; 
updatedAt: string;

}
