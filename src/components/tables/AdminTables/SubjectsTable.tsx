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
import AddSubjectModal from "@/components/AdminModals/SubjectModals/AddModal";
import ViewSubjectsModal from "@/components/AdminModals/SubjectModals/ViewModal";
import UpdateSubjectsModal from "@/components/AdminModals/SubjectModals/UpdateModal"; 

import { useSubjects } from "@/hooks/useSubjects";
import { useCourses } from "@/hooks/useCourses";
import { Subject } from "@/services/subjectService";
import { Course } from "@/services/courseService";
import DeleteSubjectModal from "@/components/AdminModals/SubjectModals/DeleteModal";
import { useSemester } from "@/hooks/useSemester";
import { Semester } from "@/services/semesterService";

export default function SubjectTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const pageSize = 10;


  const { subjectQuery, createSubject, updateSubject, deleteSubject } = useSubjects(); 
  const { courseQuery } = useCourses();
  const {semesterQuery} = useSemester();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const subjects: Subject[] = subjectQuery.data || [];
  const courses: Course[] = courseQuery.data || [];
  const semesters: Semester[] = semesterQuery.data || [];

 
  // Filtering
  const filteredData = useMemo(() => {
    return subjects.filter((subject) => {
      const searchString = [
        subject.code,
        subject.name,
        subject.description || "",
        subject.courseTitle || "",
        subject.semesterName || "",
        subject.yearLevel?.toString() || "",
        subject.type || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchString.includes(search.toLowerCase());
      const matchesCourse = selectedCourse
        ? (subject.courseTitle || "") === selectedCourse
        : true;

      return matchesSearch && matchesCourse;
    });
  }, [subjects, search, selectedCourse]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Fixed type for handleAddSubject
  const handleAddSubject = async (newSubject: Omit<Subject, "subjectId" | "createdAt" | "updatedAt" | "courseTitle" | "semesterName">) => {
    try {
      await createSubject.mutateAsync(newSubject as Subject);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add subject:", err);
    }
  };

  // Update handler
  const handleUpdateSubject = async (subjectId: string, updatedSubject: Partial<Subject>) => {
    try {
      await updateSubject.mutateAsync({ subjectId, subject: updatedSubject });
      setIsUpdateModalOpen(false);
    } catch (err) {
      console.error("Failed to update subject:", err);
    }
  };

  // Delete handler
  const handleDeleteSubject = async (subjectId: string) => {
    try {
      await deleteSubject.mutateAsync(subjectId);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Failed to delete subject:", err);
    }
  };

  // View handler
  const handleView = (subjectId: string) => {
    const subject = subjects.find(s => s.subjectId === subjectId);
    if (subject) {
      setSelectedSubject(subject);
      setIsViewModalOpen(true);
    }
  };

  // Edit handler
  const handleEdit = (subjectId: string) => {
    const subject = subjects.find(s => s.subjectId === subjectId);
    if (subject) {
      setSelectedSubject(subject);
      setIsUpdateModalOpen(true);
    }
  };

  // Delete handler
  const handleDelete = (subjectId: string) => {
    const subject = subjects.find(s => s.subjectId === subjectId);
    if (subject) {
      setSelectedSubject(subject);
      setIsDeleteModalOpen(true);
    }
  };

  // Close modal handlers
  const handleCloseViewModal = () => {
    setSelectedSubject(null);
    setIsViewModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setSelectedSubject(null);
    setIsUpdateModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setSelectedSubject(null);
    setIsDeleteModalOpen(false);
  };

  // Edit callback for view modal
  const handleEditFromView = () => {
    if (selectedSubject) {
      handleEdit(selectedSubject.subjectId);
    }
    handleCloseViewModal();
  };

  // Delete callback for view modal
  const handleDeleteFromView = () => {
    if (selectedSubject) {
      handleDelete(selectedSubject.subjectId);
    }
    handleCloseViewModal();
  };

  // Delete confirmation handler

  const handleConfirmDelete = () => {
    if (selectedSubject) {
      handleDeleteSubject(selectedSubject.subjectId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            id="search-subjects"
            placeholder="Search subjects..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white md:max-w-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            aria-label="Search subjects"
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
            className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
                       text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 
                       dark:border-white/10 dark:bg-gray-700 dark:text-white"
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
            disabled={subjectQuery.isLoading}
          >
            + Add Subject
          </button>
        </div>
      </div>

      {/* Error Message */}
      {subjectQuery.isError && (
        <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
          Failed to load subjects. Please try again.
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
                    "Type",
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
                {subjectQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="text-center dark:text-white">
                          Loading subjects...
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
                      {search || selectedCourse ? "No subjects match your filters." : "No subjects found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((subject) => (
                    <TableRow key={subject.subjectId}>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-800 dark:text-white">
                        {subject.code}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-800 dark:text-white">
                        {subject.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {subject.courseTitle || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {subject.semesterName || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {subject.yearLevel ? `${subject.yearLevel}st Year` : "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {subject.type || "N/A"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start">
                        <Badge
                          size="sm"
                          color={subject.isActive ? "success" : "error"}
                        >
                          {subject.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {new Date(subject.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {subject.updatedAt ? new Date(subject.updatedAt).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
                          <button
                            aria-label="View subject"
                            title="View"
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => handleView(subject.subjectId)}
                          >
                            <Eye size={18} className="hover:text-blue-600 transition" />
                          </button>
                          <button
                            aria-label="Edit subject"
                            title="Update"
                            className="p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            onClick={() => handleEdit(subject.subjectId)}
                          >
                            <Pencil size={18} className="hover:text-yellow-600 transition" />
                          </button>
                          <button
                            aria-label="Delete subject"
                            title="Delete"
                            className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                            onClick={() => handleDelete(subject.subjectId)}
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
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      <AddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubject}
        courses={courses.map(course => ({ 
          courseId: course.courseId, 
          title: course.title 
        }))}
        semesters={semesters}
        isLoading={createSubject.isPending}
      />

      {/* View Subject Modal */}
      <ViewSubjectsModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        subject={selectedSubject}
        onEdit={handleEditFromView}
        onDelete={handleDeleteFromView}
        // isLoading={subjectQuery.isLoading}
      />

      {/* Update Subject Modal */}
      <UpdateSubjectsModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        subject={selectedSubject}
        onSubmit={handleUpdateSubject}
        courses={courses.map(course => ({ 
          courseId: course.courseId, 
          title: course.title 
        }))}
        semesters={semesters}
        // isLoading={updateSubject.isPending}
      />

      {/* Delete Confirmation Modal */}
      <DeleteSubjectModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        subject={selectedSubject}
        onDelete={handleConfirmDelete}
 
      />
    </div>
  );
}