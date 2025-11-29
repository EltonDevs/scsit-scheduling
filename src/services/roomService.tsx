


export interface Room {
  roomId: string;
  roomCode: string;
  name: string;
  capacity: number;
  building: string;
  floor: string;
  type: string; // e.g., "LECTURE" | "LAB" | "SEMINAR" | "AUDITORIUM"
  departmentId: string;
  departmentName: string;
  status: string; // e.g., "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
  isPublic: boolean;
  equipment: string;
  createdAt: string; // ISO date string (from LocalDateTime)
  updatedAt: string; // ISO date string (from LocalDateTime)
}

import axiosInstance from "@/utils/axiosInstance";

export async function getRooms(): Promise<Room[]> {
  const res = await axiosInstance.get("/rooms");
  return res.data;
}

export async function getRoomsByDepartmentId(departmentId: string): Promise<Room[]> {
  const res = await axiosInstance.get(`/rooms/${departmentId}`);
  return res.data;
}

//create room 
export async function createRoom(
  room: Omit<Room, "roomId" | "createdAt" | "updatedAt">
): Promise<Room> {
  const res = await axiosInstance.post("/rooms/create", room);
  return res.data;
}

//update room
export async function updateRoom(
  roomId: string,
  room: Partial<Omit<Room, "roomId" | "createdAt" | "updatedAt">>
): Promise<Room> {
  const res = await axiosInstance.put(`/rooms/update/${roomId}`, room);
  return res.data;
}

//delete room
export async function deleteRoom(roomId: string): Promise<void> {
  await axiosInstance.delete(`/rooms/delete/${roomId}`);
}
