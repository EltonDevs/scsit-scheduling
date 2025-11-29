"use client";

import React, {  useState } from "react";
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
import { useModal } from "@/hooks/useModal";
import Button from "../../ui/button/Button";
import AddDepartmentModal from "@/components/AdminModals/DepartmentModals/AddModal";
import ViewDepartmentModal from "@/components/AdminModals/DepartmentModals/ViewModal";
import UpdateDepartmentModal from "@/components/AdminModals/DepartmentModals/UpdateModal";
import DeleteDepartmentModal from "@/components/AdminModals/DepartmentModals/DeleteModal";
import Spinner from "@/components/loading/Spinner";
import { Department } from "@/services/departmentService";
import { useDepartments } from "@/hooks/useDepartments";


interface DepartmentTableProps {
  onViewDean?: (id: string) => void;
}

export default function DepartmentTable({}: DepartmentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [updateOpen, setUpdateOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const pageSize = 10;

 


  const { departmentsQuery, createDept, updateDept, deleteDept } = useDepartments();

  const departments = departmentsQuery.data || [];
  const isLoading = departmentsQuery.isLoading;

  const handleUpdateDepartment = (dept: Department) => {
    setSelectedDepartment(dept);
    setUpdateOpen(true);
  };

  const handleUpdateDepartmentSave = (updatedDepartment: Department) => {
    updateDept.mutate({ departmentId: updatedDepartment.departmentId, dept: updatedDepartment });
    handleCloseUpdate();
  };

  const handleCloseUpdate = () => {
    setSelectedDepartment(null);
    setUpdateOpen(false);
  };

  const handleOpenDeleteModal = (dept: Department) => {
    setSelectedDepartment(dept);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleDeleteDepartment = (id: string) => {
    deleteDept.mutate(id);
    handleCloseDeleteModal();
  };

  const filteredData = departments.filter((dept) =>
    [dept.code, dept.name, dept.createdAt]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewDepartment = (dept: Department) => {
    setSelectedDepartment(dept);
    setViewOpen(true);
  };

  const handleCloseView = () => {
    setSelectedDepartment(null);
    setViewOpen(false);
  };

  const handleAddDepartment = (newDepartment: Department) => {
    createDept.mutate(newDepartment);
  };

  return (
    <>
      {/* Header with search and add department */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            className="w-full sm:w-auto rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
            onClick={openModal}
            disabled={isLoading}
          >
            + Add Department
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow className="dark:text-white bg-gray-700 dark:bg-gray-700">
                  <TableCell isHeader className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100">
                    Code
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100">
                    Department Name
                  </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100">
                    Description
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100">
                    Created At
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100">
                    Updated At
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-theme-xs text-start font-medium text-gray-100">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="text-center p-4 dark:text-white">Loading departments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}  className="text-center p-4 dark:text-white">
                      No departments found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((dept) => (
                    <TableRow key={dept.departmentId} className="hover:bg-gray-50 dark:hover:bg-white/5">
                      <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-800 dark:text-white">
                        {dept.code}
                      </TableCell>
                     <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-800 dark:text-white">
                        {dept.name}
                      </TableCell>
                     <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                          {typeof dept.description === 'string' ? dept.description : String(dept.description)}
                      </TableCell>
                     <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        {new Date(dept.createdAt).toLocaleString()} 
                      </TableCell>

                    <TableCell className="px-5 py-4 text-theme-sm text-start text-gray-500 dark:text-gray-400">
                        { new Date(dept.updatedAt).toLocaleString()} 
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start">
                        <Badge
                          size="sm"
                          color={dept.status === "ACTIVE" ? "success" : "error"}
                        >
                          {dept.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
                          <button
                            title="View"
                            onClick={() => handleViewDepartment(dept)}
                            aria-label={`View department ${dept.name}`}
                          >
                            <Eye size={18} className="hover:text-blue-600 transition" />
                          </button>
                          <button
                            title="Update"
                            onClick={() => handleUpdateDepartment(dept)}
                            aria-label={`Update department ${dept.name}`}
                          >
                            <Pencil size={18} className="hover:text-yellow-500 transition" />
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleOpenDeleteModal(dept)}
                            aria-label={`Delete department ${dept.name}`}
                          >
                            <Trash2 size={18} className="hover:text-red-500 transition" />
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

      {/* Modals */}
      <AddDepartmentModal
        isOpen={isOpen}
        onClose={closeModal}
        onSave={handleAddDepartment}
      />
      <ViewDepartmentModal
        isOpen={viewOpen}
        onClose={handleCloseView}
        department={selectedDepartment}
      />
      <UpdateDepartmentModal
        isOpen={updateOpen}
        onClose={handleCloseUpdate}
        department={selectedDepartment}
        onSave={handleUpdateDepartmentSave}
      />
      <DeleteDepartmentModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        department={selectedDepartment}
        onDelete={handleDeleteDepartment}
      />

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}