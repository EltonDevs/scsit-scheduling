


// export interface Room {
//   roomId: string;
//   roomCode: string;
//   name: string;
//   capacity: number;
//   building: string;
//   floor: string;
//   type: string; // e.g., "LECTURE" | "LAB" | "SEMINAR" | "AUDITORIUM"
//   departmentId: string;
//   departmentName: string;
//   status: string; // e.g., "AVAILABLE" | "OCCUPIED" | "MAINTENANCE"
//   isPublic: boolean;
//   equipment: string;
//   createdAt: string; // ISO date string (from LocalDateTime)
//   updatedAt: string; // ISO date string (from LocalDateTime)
// }

// import axiosInstance from "@/utils/axiosInstance";

// export async function getRooms(): Promise<Room[]> {
//   const res = await axiosInstance.get("/rooms");
//   return res.data;
// }

// export async function getRoomsByDepartmentId(departmentId: string): Promise<Room[]> {
//   const res = await axiosInstance.get(`/rooms/${departmentId}`);
//   return res.data;
// }

// //create room 
// export async function createRoom(
//   room: Omit<Room, "roomId" | "createdAt" | "updatedAt">
// ): Promise<Room> {
//   const res = await axiosInstance.post("/rooms/create", room);
//   return res.data;
// }

// //update room
// export async function updateRoom(
//   roomId: string,
//   room: Partial<Omit<Room, "roomId" | "createdAt" | "updatedAt">>
// ): Promise<Room> {
//   const res = await axiosInstance.put(`/rooms/update/${roomId}`, room);
//   return res.data;
// }

// //delete room
// export async function deleteRoom(roomId: string): Promise<void> {
//   await axiosInstance.delete(`/rooms/delete/${roomId}`);
// }


import { delay, MOCK_CONFIG } from "@/config/mockConfig";
import { mockRooms } from "@/data/all-data-context";
import axiosInstance from "@/utils/axiosInstance";

export interface Room {
  roomId: string;
  roomCode: string;
  name: string;
  capacity: number;
  building: string;
  floor: string;
  type: "LECTURE" | "LAB" | "SEMINAR" | "AUDITORIUM";
  departmentId?: string;
  departmentName?: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  isPublic: boolean;
  equipment?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockRoomsData = [...mockRooms];

export async function getRooms(): Promise<Room[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockRoomsData;
  }
  const res = await axiosInstance.get("/rooms");
  return res.data;
}

export async function getRoomsByDepartmentId(departmentId: string): Promise<Room[]> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    return mockRoomsData.filter(r => r.departmentId === departmentId);
  }
  const res = await axiosInstance.get(`/rooms/${departmentId}`);
  return res.data;
}

export async function createRoom(
  room: Omit<Room, "roomId" | "createdAt" | "updatedAt">
): Promise<Room> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const newRoom: Room = {
      ...room,
      roomId: `room-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockRoomsData.push(newRoom);
    return newRoom;
  }
  const res = await axiosInstance.post("/rooms/create", room);
  return res.data;
}

export async function updateRoom(
  roomId: string,
  room: Partial<Omit<Room, "roomId" | "createdAt" | "updatedAt">>
): Promise<Room> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockRoomsData.findIndex(r => r.roomId === roomId);
    if (index === -1) throw new Error(`Room ${roomId} not found`);
    mockRoomsData[index] = {
      ...mockRoomsData[index],
      ...room,
      updatedAt: new Date().toISOString(),
    };
    return mockRoomsData[index];
  }
  const res = await axiosInstance.put(`/rooms/update/${roomId}`, room);
  return res.data;
}

export async function deleteRoom(roomId: string): Promise<void> {
  if (MOCK_CONFIG.USE_MOCK_DATA) {
    await delay(MOCK_CONFIG.MOCK_DELAY);
    const index = mockRoomsData.findIndex(r => r.roomId === roomId);
    if (index === -1) throw new Error(`Room ${roomId} not found`);
    mockRoomsData.splice(index, 1);
    return;
  }
  await axiosInstance.delete(`/rooms/delete/${roomId}`);
}