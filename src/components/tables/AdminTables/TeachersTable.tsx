"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import Image from "next/image";
import Pagination from "../Pagination";
import { Eye, Trash2 } from "lucide-react";
import DeleteTeacherModal from "@/components/AdminModals/TeacherModals/DeleteTeacherModal";
import { useModal } from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import Spinner from "@/components/loading/Spinner"; 
import { useTeachers } from "@/hooks/useTeacher";
import { Teacher } from "@/services/teacherService";

export default function TeacherTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  // Fetch teachers using the hook
  const { teacherQuery } = useTeachers();
  const teachers = teacherQuery.data || [];

  const isLoading = teacherQuery.isLoading;
  const error = teacherQuery.error;

  const pageSize = 10;

  // Filter teachers based on search and department
  const filteredData = teachers.filter((teacher) => {
    const matchesSearch = [teacher.firstName, teacher.email, teacher.phone || "", teacher.departmentName || teacher.departmentId]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDepartment = selectedDepartment
      ? (teacher.departmentName || teacher.departmentId) === selectedDepartment
      : true;

    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const router = useRouter();

  const handleView = (userId: string) => {
    router.push(`/admin/TeacherPage/profile/${userId}`);
  };

  const handleDelete = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    openDeleteModal();
  };

  const handleCloseDeleteModal = () => {
    setSelectedTeacher(null);
    closeDeleteModal();
  };

  // Reset pagination on filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setCurrentPage(1);
  };

  // Generate dynamic department options
  const uniqueDepartments = Array.from(new Set(
    teachers.map(teacher => teacher.departmentName || teacher.departmentId)
  )).sort();

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Failed to load teachers: {error.message || "Unknown error"}
      </div>
    );
  }

  return (
    <>
      {/* Filter Bar */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          className="w-full md:max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          value={search}
          onChange={handleSearchChange}
          disabled={isLoading}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            disabled={isLoading || uniqueDepartments.length === 0}
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button 
            className="w-full sm:w-auto rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            + Add Teacher
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.03]">
                <TableRow className="dark:text-white bg-gray-700 dark:bg-gray-700">
                  {["Name", "Email", "Phone", "Role", "Department", "Status", "Action"].map((heading) => (
                    <TableCell
                      key={heading}
                      isHeader
                      className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {/* Fixed: Added proper keys for conditional rendering */}
                {isLoading ? (
                  <TableRow key="loading">
                    <TableCell
                      colSpan={6}
                      className="text-center p-8"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="dark:text-white">Loading teachers...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell
                      colSpan={6}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {search || selectedDepartment ? "No teachers match your filters." : "No teachers found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((teacher, index) => (
                    <TableRow key={`teacher-${teacher.userId}-${index}`}>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            {teacher.profile_picture ? (
                              <Image
                                width={40}
                                height={40}
                                src={teacher.profile_picture}
                                alt={`${teacher.firstName} ${teacher.lastName}`}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block font-medium text-theme-sm text-gray-800 dark:text-white/90">
                              {teacher.firstName} {teacher.lastName}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {teacher.email}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {teacher.phone || "Not provided"} 
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {teacher.role || "Not provided"} 
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {teacher.departmentName || teacher.departmentId || "Unknown"} 
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-start">
                        {/* Fixed: Duplicate teacher.isActive */}
                        <Badge
                          size="sm"
                          color={(teacher.isActive ?? teacher.isActive ?? false) ? "success" : "error"}
                        >
                          {(teacher.isActive ?? teacher.isActive ?? false) ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
                          <button 
                            title="View"
                            onClick={() => handleView(teacher.userId)}
                            disabled={isLoading}
                          >
                            <Eye size={18} className="hover:text-blue-600 transition disabled:opacity-50" />
                          </button>
                          <button 
                            title="Delete"
                            onClick={() => handleDelete(teacher)} 
                            disabled={isLoading}
                          >
                            <Trash2 size={18} className="hover:text-red-500 transition disabled:opacity-50" />
                          </button>
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
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <DeleteTeacherModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDeleteModal}
        teacher={selectedTeacher}
      />
    </>
  );
}