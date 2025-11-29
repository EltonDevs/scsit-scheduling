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
import AddSectionModal from "@/components/AdminModals/SectionsModal/AddModal";
import ViewSectionModal from "@/components/AdminModals/SectionsModal/ViewModal";
import UpdateSectionModal from "@/components/AdminModals/SectionsModal/UpdateModal";
import DeleteSectionModal from "@/components/AdminModals/SectionsModal/DeleteModal";
import { useSections } from "@/hooks/useSection";
import { useCourses } from "@/hooks/useCourses";
import { useDepartments } from "@/hooks/useDepartments";
import { Course } from "@/services/courseService";
import { Department } from "@/services/departmentService";
import { Section } from "@/services/sectionService";
import { useSemester } from "@/hooks/useSemester";
import { Semester } from "@/services/semesterService";

export default function SectionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const pageSize = 10;

  const { sectionQuery, createSections, updateSections, deleteSections } = useSections();
  const { courseQuery } = useCourses();
  const { departmentsQuery } = useDepartments();
  const { semesterQuery } = useSemester();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections: Section[] = sectionQuery.data || [];
  const courses: Course[] = courseQuery.data || [];
  const departments: Department[] = departmentsQuery.data || [];
  const semesters: Semester[] = semesterQuery.data || [];

  // Filtering
  const filteredData = useMemo(() => {
    return sections.filter((section) => {
      const searchString = [
        section.code,
        section.name,
        section.courseTitle || "",
        section.semesterName || "",
        section.yearLevel?.toString() || "",
        section.maxStudents?.toString() || "",
        section.status || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchString.includes(search.toLowerCase());
      const matchesCourse = selectedCourse
        ? (section.courseTitle || "") === selectedCourse
        : true;

      return matchesSearch && matchesCourse;
    });
  }, [sections, search, selectedCourse]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  
  // Fixed type for handleAddSection
  const handleAddSection = async (newSection: Omit<Section, "sectionId" | "createdAt" | "updatedAt" | "courseTitle" | "semesterName">) => {
    try {
      await createSections.mutateAsync(newSection as Section);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add section:", err);
    }
  };

  // Update handler
  const handleUpdateSection = async (sectionId: string, updatedSection: Partial<Section>) => {
    try {
      await updateSections.mutateAsync({ sectionId, section: updatedSection });
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error("Failed to update section:", err);
    }
  };

  // Delete handler
  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSections.mutateAsync(sectionId);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete section:", err);
    }
  };

  // View handler
  const handleView = (sectionId: string) => {
    const section = sections.find(s => s.sectionId === sectionId);
    if (section) {
      setSelectedSection(section);
      setIsViewModalOpen(true);
    }
  };

  // Edit handler
  const handleEdit = (sectionId: string) => {
    const section = sections.find(s => s.sectionId === sectionId);
    if (section) {
      setSelectedSection(section);
      setIsUpdateModalOpen(true);
    }
  };

  // Delete handler
  const handleDelete = (sectionId: string) => {
    const section = sections.find(s => s.sectionId === sectionId);
    if (section) {
      setSelectedSection(section);
      setIsDeleteModalOpen(true);
    }
  };

  // Close modal handlers
  const handleCloseViewModal = () => {
    setSelectedSection(null);
    setIsViewModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedSection(null);
    setIsUpdateModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setSelectedSection(null);
    setIsDeleteModalOpen(false);
  };

  // Edit callback for view modal
  const handleEditFromView = () => {
    if (selectedSection) {
      handleEdit(selectedSection.sectionId);
    }
    handleCloseViewModal();
  };

  // Delete callback for view modal
  const handleDeleteFromView = () => {
    if (selectedSection) {
      handleDelete(selectedSection.sectionId);
    }
    handleCloseViewModal();
  };

  // Delete confirmation handler
  const handleConfirmDelete = () => {
    if (selectedSection) {
      handleDeleteSection(selectedSection.sectionId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            id="search-sections"
            placeholder="Search sections..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white md:max-w-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search sections"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setCurrentPage(1);
            }}
            disabled={courseQuery.isLoading || !courses.length}
            className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>

          <button
            className="w-full rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 sm:w-auto disabled:opacity-50"
            onClick={() => setIsAddModalOpen(true)}
            disabled={sectionQuery.isLoading}
          >
            + Add Section
          </button>
        </div>
      </div>

      {/* Error Message */}
      {sectionQuery.isError && (
        <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
          Failed to load sections. Please try again.
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.03]">
                <TableRow className="bg-gray-700">
                  {[
                    "Code",
                    "Name",
                    "Course",
                    "Semester",
                    "Year Level",
                    "Max Students",
                    "Status",
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
                {sectionQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="text-center dark:text-white">
                          Loading sections...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="p-4 text-center dark:text-white"
                    >
                      {search || selectedCourse ? "No sections match your filters." : "No sections found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((section) => (
                    <TableRow key={section.sectionId}>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-800 dark:text-white">
                        {section.code}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-800 dark:text-white">
                        {section.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {section.courseTitle || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {section.semesterName || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {section.yearLevel ? `${section.yearLevel}st Year` : "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {section.maxStudents || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start">
                        <Badge
                          size="sm"
                          color={section.status === "ACTIVE" ? "success" : "error"}
                        >
                          {section.status.charAt(0).toUpperCase() +
                            section.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {new Date(section.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {section.updatedAt ? new Date(section.updatedAt).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
                          <button
                            aria-label="View section"
                            title="View"
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => handleView(section.sectionId)}
                          >
                            <Eye size={18} className="hover:text-blue-600 transition" />
                          </button>
                          <button
                            aria-label="Edit section"
                            title="Update"
                            className="p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            onClick={() => handleEdit(section.sectionId)}
                          >
                            <Pencil size={18} className="hover:text-yellow-600 transition" />
                          </button>
                          <button
                            aria-label="Delete section"
                            title="Delete"
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => handleDelete(section.sectionId)}
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

      {/* Pagination */}
        <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {/* Modals */}
      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSection}
        courses={courses.map(course => ({
          courseId: course.courseId,
          title: course.title,
          departmentId: course.departmentId
        }))}
        semesters={semesters.map(semester => ({
          semesterId: semester.semesterId,
          name: semester.name
        }))}
        departments={departments.map(dept => ({
          departmentId: dept.departmentId,
          name: dept.name
        }))}
        // isLoading={createSections.isPending}
      />

      {/* View Section Modal */}
      <ViewSectionModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        section={selectedSection}
        onEdit={handleEditFromView}
        onDelete={handleDeleteFromView}
      />

      {/* Update Section Modal */}
      <UpdateSectionModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        section={selectedSection}
        onSubmit={handleUpdateSection}
        courses={courses.map(course => ({
          courseId: course.courseId,
          title: course.title,
          departmentId: course.departmentId
        }))}
        semesters={semesters.map(semester => ({
          semesterId: semester.semesterId,
          name: semester.name
        }))}
        departments={departments.map(dept => ({
          departmentId: dept.departmentId,
          name: dept.name
        }))}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSectionModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        section={selectedSection}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}