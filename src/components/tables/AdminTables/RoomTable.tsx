"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Eye, Trash2, Pencil } from "lucide-react";
import Badge from "../../ui/badge/Badge";
import Pagination from "../Pagination";
import Spinner from "@/components/loading/Spinner";
import AddRoomModal from "@/components/AdminModals/RoomModals/AddModal";
import ViewRoomModal from "@/components/AdminModals/RoomModals/ViewModal";
import UpdateRoomModal from "@/components/AdminModals/RoomModals/UpdateModal";
import DeleteRoomModal from "@/components/AdminModals/RoomModals/DeleteModal";
import { useRooms } from "@/hooks/useRoom";
import { useDepartments } from "@/hooks/useDepartments";
import { Room } from "@/services/roomService";
import { Department } from "@/services/departmentService";
import { useAuth } from "@/context/AuthContext";

export default function RoomTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const pageSize = 10;
  const { user } = useAuth();

  const { roomQuery, createRooms, updateRooms, deleteRooms } = useRooms();
  const { departmentsQuery } = useDepartments();
  
  const rooms: Room[] = useMemo(() => roomQuery.data || [], [roomQuery.data]);
  const departments: Department[] = departmentsQuery.data || [];

  // Extract roles from user
  const extractRoles = (roleString: string | undefined) => {
    if (!roleString) return [];
    return roleString.replace(/[\[\]]/g, "").split(",").map((role) => role.trim());
  };
  const userRoles = extractRoles(user?.role);
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  // Filtering
  const filteredData = useMemo(() => {
    return rooms.filter((room) => {
      const searchString = [
        room.roomCode,
        room.name || "",
        room.building || "",
        room.floor || "",
        room.type,
        room.departmentName || "",
        room.status,
        room.equipment || "",
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchString.includes(search.toLowerCase());
      const matchesDepartment = selectedDepartment
        ? room.departmentName === selectedDepartment
        : true;
      return matchesSearch && matchesDepartment;
    });
  }, [rooms, search, selectedDepartment]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // // Handlers
  // const handlePageChange = (page: number) => {
  //   if (page >= 1 && page <= totalPages) setCurrentPage(page);
  // };

  const handleAddRoom = async (newRoom: Omit<Room, "roomId" | "createdAt" | "updatedAt" | "departmentName">) => {
    try {
      await createRooms.mutateAsync(newRoom as Room);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add room:", err);
      alert("Failed to add room. Please try again.");
    }
  };

  const handleUpdateRoom = async (roomId: string, updatedRoom: Partial<Room>) => {
    try {
      await updateRooms.mutateAsync({ roomId, room: updatedRoom });
      setIsUpdateModalOpen(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Failed to update room:", err);
      alert("Failed to update room. Please try again.");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await deleteRooms.mutateAsync(roomId);
      setIsDeleteModalOpen(false);
      setSelectedRoom(null);
    } catch (err) {
      console.error("Failed to delete room:", err);
      alert("Failed to delete room. Please try again.");
    }
  };

  const handleView = (roomId: string) => {
    const room = rooms.find((r) => r.roomId === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (roomId: string) => {
    const room = rooms.find((r) => r.roomId === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsUpdateModalOpen(true);
    }
  };

  const handleDelete = (roomId: string) => {
    const room = rooms.find((r) => r.roomId === roomId);
    if (room) {
      setSelectedRoom(room);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseViewModal = () => {
    setSelectedRoom(null);
    setIsViewModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedRoom(null);
    setIsUpdateModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setSelectedRoom(null);
    setIsDeleteModalOpen(false);
  };

  const handleEditFromView = () => {
    if (selectedRoom) {
      handleEdit(selectedRoom.roomId);
    }
    handleCloseViewModal();
  };

  const handleDeleteFromView = () => {
    if (selectedRoom) {
      handleDelete(selectedRoom.roomId);
    }
    handleCloseViewModal();
  };

  const handleConfirmDelete = () => {
    if (selectedRoom) {
      handleDeleteRoom(selectedRoom.roomId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            id="search-rooms"
            placeholder="Search by code, name, building, floor, type, or department..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white md:max-w-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search rooms"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {isAdmin && (
            <select
              id="departmentFilter"
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setCurrentPage(1);
              }}
              disabled={departmentsQuery.isLoading || !departments.length}
              className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-700 dark:text-white"
              aria-label="Filter by department"
            >
              <option value="">All Departments</option>
              {departments.map((dep) => (
                <option key={dep.departmentId} value={dep.name}>
                  {dep.name}
                </option>
              ))}
            </select>
          )}

       
            <button
              className="w-full rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 sm:w-auto disabled:opacity-50"
              onClick={() => setIsAddModalOpen(true)}
              disabled={roomQuery.isLoading}
              aria-label="Add new room"
            >
              + Add Room
            </button>
        
        </div>
      </div>

      {/* Error Message */}
      {roomQuery.isError && (
        <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
          Failed to load rooms. Please try again.
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.03]">
                <TableRow className="bg-gray-700">
                  {[
                    "Room Code",
                    "Name",
                    "Capacity",
                    "Building",
                    "Floor",
                    "Type",
                    "Department",
                    "Status",
                    "Public",
                    "Equipment",
                    "Created At",
                    "Updated At",
                    "Action",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="px-5 py-3 text-start text-xs font-medium text-gray-100"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {roomQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={13} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="text-center dark:text-white">
                          Loading rooms...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={13}
                      className="p-4 text-center dark:text-white"
                    >
                      {search || selectedDepartment ? "No rooms match your filters." : "No rooms found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((room) => (
                    <TableRow key={room.roomId}>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-800 dark:text-white">
                        {room.roomCode}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-800 dark:text-white">
                        {room.name || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {room.capacity || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {room.building || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {room.floor || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400 capitalize">
                        {room.type.toLowerCase()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {room.departmentName || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start">
                        <Badge
                          size="sm"
                          color={
                            room.status.toLowerCase() === "available"
                              ? "success"
                              : room.status.toLowerCase() === "maintenance"
                              ? "warning"
                              : "error"
                          }
                        >
                          {room.status.charAt(0).toUpperCase() + room.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-800 dark:text-white">
                        {room.isPublic ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {room.equipment || "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {new Date(room.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {room.updatedAt ? new Date(room.updatedAt).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
                          <button
                            aria-label="View room"
                            title="View"
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => handleView(room.roomId)}
                          >
                            <Eye size={18} className="hover:text-blue-600 transition" />
                          </button>
                         
                            <>
                              <button
                                aria-label="Edit room"
                                title="Update"
                                className="p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                onClick={() => handleEdit(room.roomId)}
                              >
                                <Pencil size={18} className="hover:text-yellow-600 transition" />
                              </button>
                              <button
                                aria-label="Delete room"
                                title="Delete"
                                className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                onClick={() => handleDelete(room.roomId)}
                              >
                                <Trash2 size={18} className="hover:text-red-600 transition" />
                              </button>
                            </>
                        
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modals */}
    
        <AddRoomModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddRoom}
          departments={departments.map((dep) => ({
            departmentId: dep.departmentId,
            name: dep.name,
          }))}
          isLoading={createRooms.isPending}
        />
  

      <ViewRoomModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        room={selectedRoom}
        onEdit={isAdmin ? handleEditFromView : undefined}
        onDelete={isAdmin ? handleDeleteFromView : undefined}
        isLoading={roomQuery.isLoading}
      />

    
        <UpdateRoomModal
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          room={selectedRoom}
          onUpdate={handleUpdateRoom}
          departments={departments.map((dep) => ({
            departmentId: dep.departmentId,
            name: dep.name,
          }))}
          isLoading={updateRooms.isPending}
        />
     

    
        <DeleteRoomModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          room={selectedRoom}
          onDelete={handleConfirmDelete}
          isLoading={deleteRooms.isPending}
        />
  
    </div>
  );
}