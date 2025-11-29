/* eslint-disable @typescript-eslint/no-empty-object-type */
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
import Image from "next/image";
import Pagination from "../Pagination";
import Spinner from "@/components/loading/Spinner";
import { Dean } from "@/services/deanService";
import DeleteDeanModal from "@/components/AdminModals/DeansModals/DeleteDeanModal";
// import ViewDeanModal from "@/components/AdminModals/DeansModals/ViewDeanModal";
import { useDeans } from "@/hooks/useDeans";
// import { useDepartments } from "@/hooks/useDepartments";
// import { Department } from "@/services/departmentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DeanTableProps {}

export default function DeanTable({}: DeanTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDean, setSelectedDean] = useState<Dean | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const pageSize = 10;

  const { deanQuery } = useDeans();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deans: Dean[] = deanQuery.data || [];
  // const { departmentsQuery } = useDepartments();
  // const departments: Department[] = departmentsQuery.data || [];
  const queryClient = useQueryClient();
  const router = useRouter();

  // Delete dean mutation
  const deleteDeanMutation = useMutation({
    mutationFn: async (dean: Dean) => {
      // TODO: Replace with actual deleteDean API call
      console.log("Deleting dean:", dean.userId);
      // Example API call:
      // await deanService.deleteDean(dean.id);
      return dean;
    },
    onSuccess: (dean) => {
      queryClient.invalidateQueries({ queryKey: ["deans"] });
      console.log("Dean deleted successfully:", dean.userId);
      setIsDeleteModalOpen(false);
      setSelectedDean(null);
    },
    onError: (error) => {
      console.error("Failed to delete dean:", error);
      alert("Failed to delete dean. Please try again.");
    },
  });

 
 
  const filteredData = useMemo(() => {
    return deans.filter((dean) => {
      const searchString = [
        dean.firstName,
        dean.lastName,
        dean.email,
        dean.phone || "",
        dean.departmentName || dean.departmentId,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchString.includes(search.toLowerCase());
      const matchesDepartment = selectedDepartment
        ? (dean.departmentName || dean.departmentId) === selectedDepartment
        : true;
      return matchesSearch && matchesDepartment;
    });
  }, [deans, search, selectedDepartment]);

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

  const handleView = (id: string) => {
    const dean = deans.find(d => d.userId === id);
    if (dean) {
      setSelectedDean(dean);
      setIsViewModalOpen(true);
    } else {
      router.push(`/DeanPage/profile/${id}`);
    }
  };

  const handleEdit = (userId: string) => {
    const dean = deans.find(d => d.userId === userId);
    if (dean) {
      setSelectedDean(dean);
      setIsUpdateModalOpen(true);
      if (isViewModalOpen) {
        setIsViewModalOpen(false);
      }
    }
  };



  const handleDelete = (dean: Dean) => {
    setSelectedDean(dean);
    setIsDeleteModalOpen(true);
    if (isViewModalOpen) {
      setIsViewModalOpen(false);
    }
    if (isUpdateModalOpen) {
      setIsUpdateModalOpen(false);
    }
  };

  const handleDeleteConfirm = (dean: Dean) => {
    deleteDeanMutation.mutate(dean);
  };

  // const handleViewModalClose = () => {
  //   setIsViewModalOpen(false);
  // };



  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedDean(null);
  };

  // const handleEditFromModal = () => {
  //   if (selectedDean) {
  //     handleEdit(selectedDean.userId);
  //   }
  // };

  // const handleDeleteFromModal = () => {
  //   if (selectedDean) {
  //     handleDelete(selectedDean);
  //   }
  // };

  // Generate dynamic department options
  const uniqueDepartments = Array.from(
    new Set(deans.map(dean => dean.departmentName || dean.departmentId))
  ).sort();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          className="w-full md:max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          disabled={deanQuery.isLoading}
          aria-label="Search deans"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            className="w-full sm:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setCurrentPage(1);
            }}
            disabled={deanQuery.isLoading || uniqueDepartments.length === 0}
            aria-label="Filter by department"
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
            onClick={() => console.log("Add Dean clicked")} // TODO: Implement AddDeanModal
            disabled={deanQuery.isLoading}
            aria-label="Add new dean"
          >
            + Add Dean
          </button>
        </div>
      </div>

      {deanQuery.error && (
        <div className="rounded-md bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-200">
          Failed to load deans. Please try again later.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.03]">
                <TableRow className="bg-gray-700 dark:bg-gray-700">
                  {["Name", "Email", "Phone", "Department", "Status", "Action"].map((heading) => (
                    <TableCell
                      key={heading}
                      isHeader
                      className="px-5 py-3 text-xs font-medium text-gray-100 text-start"
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {deanQuery.isLoading ? (
                  <TableRow key="loading">
                    <TableCell colSpan={6} className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="dark:text-white">Loading deans...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow key="empty">
                    <TableCell
                      colSpan={6}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {search || selectedDepartment ? "No deans match your filters." : "No deans found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((dean) => (
                    <TableRow key={dean.userId}>
                      <TableCell className="px-5 py-4 text-sm text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden rounded-full">
                            {dean.profile_picture ? (
                              <Image
                                width={40}
                                height={40}
                                src={dean.profile_picture}
                                alt={`${dean.firstName} ${dean.lastName}`}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block font-medium text-sm text-gray-800 dark:text-white/90">
                              {dean.firstName} {dean.lastName}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {dean.email}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {dean.phone || "Not provided"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start text-gray-500 dark:text-gray-400">
                        {dean.departmentName || dean.departmentId || "Unknown"}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-start">
                        <Badge
                          size="sm"
                          color={dean.isActive ? "success" : "error"}
                        >
                          {dean.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-white/80">
                          <button
                            title="View"
                            aria-label="View dean"
                            onClick={() => handleView(dean.userId)}
                            disabled={deanQuery.isLoading}
                            className="transition hover:text-blue-600 disabled:opacity-50"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            title="Edit"
                            aria-label="Edit dean"
                            onClick={() => handleEdit(dean.userId)}
                            disabled={deanQuery.isLoading}
                            className="transition hover:text-yellow-500 disabled:opacity-50"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            title="Delete"
                            aria-label="Delete dean"
                            onClick={() => handleDelete(dean)}
                            disabled={deanQuery.isLoading}
                            className="transition hover:text-red-500 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
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

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
{/* 
      <ViewDeanModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        dean={selectedDean}
        onEdit={handleEditFromModal}
        onDelete={handleDeleteFromModal}
        isLoading={deanQuery.isLoading}
      /> */}



      <DeleteDeanModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        dean={selectedDean}
        onDelete={handleDeleteConfirm}
        isLoading={deleteDeanMutation.isPending}
      />
    </div>
  );
}