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
import Pagination from "../Pagination";
import { Eye, Trash2, Pencil } from "lucide-react";
import AddCourseModal from "@/components/AdminModals/CourseModals/AddModal";
import ViewCourseModal from "@/components/AdminModals/CourseModals/ViewModal";
import UpdateCourseModal from "@/components/AdminModals/CourseModals/UpdateModal";
import DeleteCourseModal from "@/components/AdminModals/CourseModals/DeleteModal"; // Add this import
import Spinner from "@/components/loading/Spinner";
import { useCourses } from "@/hooks/useCourses";
import { useDepartments } from "@/hooks/useDepartments";
import { useAuth } from "@/context/AuthContext";
import { Course } from "@/services/courseService";

export default function CourseTable() { 
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

  const { 
    courseQuery, 
    createCourses,
    updateCourses,
    deleteCourses, 
  } = useCourses(); 

  const { departmentsQuery } = useDepartments();
  const { user } = useAuth(); 

  const courses = courseQuery.data || [];
  const departments = departmentsQuery.data || [];

  const isLoading = courseQuery.isLoading || departmentsQuery.isLoading;
  const error = courseQuery.error || departmentsQuery.error;

  const pageSize = 10;

  // Helper function to extract roles from bracketed format
  const extractRoles = (roleString: string | undefined) => {
    if (!roleString) return [];
    
    // Remove brackets and split by comma if multiple roles
    const cleanRoles = roleString.replace(/[\[\]]/g, '').split(',').map(role => role.trim());
    return cleanRoles;
  };

  // Get user's roles array
  const userRoles = extractRoles(user?.role);

  // Check if user has specific role
  const hasRole = (role: string) => userRoles.includes(role);
  
  const isAdmin = hasRole("ROLE_ADMIN");
  const isDean = hasRole("ROLE_DEAN");

  // Filter courses
  const filteredData = courses.filter((course) => {
    const matchesSearch = [course.courseCode, course.title, course.departmentName]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    
    // For deans, filter to only show their own department
    let matchesDepartment = true;
    if (isDean) {
      const deanDepartment = user?.departmentId; 
      matchesDepartment = course.departmentId === deanDepartment;
    } else {
      matchesDepartment =
        selectedDepartment === "" || course.departmentId === selectedDepartment;
    }
    
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleAddCourse = async (newCourse: {
    courseCode: string;
    title: string;
    departmentId: string;
    departmentName: string;
    description?: string | null;
    durationYears?: number | null;
    status: "ACTIVE" | "INACTIVE";
  }) => {
    try {
      await createCourses.mutateAsync(newCourse);
    } catch (err) {
      console.error("Failed to add course:", err);
    }
  };

  const handleUpdateCourse = async (courseId: string, updatedCourse: Partial<Course>) => {
    try {
      const apiPayload = {
        courseId,
        course: {
          courseCode: updatedCourse.courseCode,
          title: updatedCourse.title,
          department: updatedCourse.departmentId,
          status: updatedCourse.status,
          description: updatedCourse.description, // Add description if needed
        },
      };

      await updateCourses.mutateAsync(apiPayload);
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error("Failed to update course:", err);
    }
  };

  // Delete handler
  const handleDeleteCourse = async (course: Course) => {
    try {
      // Use your delete mutation here
      await deleteCourses.mutateAsync(course.courseId);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete course:", err);
      // You might want to show a toast notification here
    }
  };

  // View handler
  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  // Update handler
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsUpdateModalOpen(true);
  };

  // Delete handler
  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  // Close modals
  const handleCloseViewModal = () => {
    setSelectedCourse(null);
    setIsViewModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedCourse(null);
    setIsUpdateModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setSelectedCourse(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search courses
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search..."
            className="w-full md:max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            disabled={isLoading}
          />
        </div>

        {/* Only show department filter for admins */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {isAdmin && (
            <>
              <label htmlFor="department" className="sr-only">
                Filter by department
              </label>
              <select
                id="department"
                className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-700 dark:text-white disabled:opacity-50"
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={isLoading || departments.length === 0}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
        

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            className="w-full sm:w-auto rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLoading}
          >
            + Add Course
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          Failed to load data: {error.message || "Unknown error"}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.03]">
                <TableRow className="dark:text-white bg-gray-700 dark:bg-gray-700">
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Code
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Title
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Department
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Created At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Updated At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow key="loading">
                    <TableCell
                      colSpan={7}
                      className="text-center p-8"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="dark:text-white">Loading courses...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell
                      colSpan={7}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {search || selectedDepartment ? "No courses match your filters." : "No courses found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((course, index) => (
                    <TableRow key={`course-${course.courseId}-${index}`}>
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-800 dark:text-white">
                        {course.courseCode}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-800 dark:text-white">
                        {course.title}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {course.departmentName}
                      </TableCell>
                       <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {course.description || "Not Provided"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-start">
                        <Badge
                          size="sm"
                          color={course.status === "ACTIVE" ? "success" : "error"}
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
                          <button
                            title="View"
                            onClick={() => handleViewCourse(course)}
                            aria-label={`View details for ${course.courseCode}`}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Eye size={18} className="hover:text-blue-600 transition" />
                          </button>
                          <button
                            title="Update"
                            onClick={() => handleEditCourse(course)}
                            aria-label={`Edit ${course.courseCode}`}
                            className="p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          >
                            <Pencil size={18} className="hover:text-yellow-600 transition" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleDeleteClick(course)}
                            aria-label={`Delete ${course.courseCode}`}
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash2 size={18} className="hover:text-red-600 transition" />
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

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
  
    

      {/* Modals */}
      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCourse}
        departments={departments}
      />

      {/* View Course Modal */}
      <ViewCourseModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        course={selectedCourse}
      />
      
      {/* Update Course Modal */}
      <UpdateCourseModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        course={selectedCourse}
        departments={departments}
        onUpdate={handleUpdateCourse}
        isLoading={updateCourses.isPending}
      />

      {/* Delete Course Modal */}
      <DeleteCourseModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        course={selectedCourse}
        onDelete={handleDeleteCourse}
      />
    </>
  );
}