"use client";

import React, { useState, useMemo } from "react";
import Pagination from "@/components/tables/Pagination";
import Spinner from "@/components/loading/Spinner";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Printer } from "lucide-react";

import { useSchedules } from "@/hooks/useSchedules";
import { useRooms } from "@/hooks/useRoom";
import { useTeachers } from "@/hooks/useTeacher";
import { useSubjects } from "@/hooks/useSubjects";

import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";

import type { DayOfWeek, Schedule } from "@/types/Schedule";
import type { Room } from "@/services/roomService";
import type { Teacher } from "@/services/teacherService";
import type { Subject } from "@/services/subjectService";

import AddScheduleModal from "../AdminModals/ScheduleModals/AddModal";
import UpdateScheduleModal from "../AdminModals/ScheduleModals/UpdateModal";
import ViewScheduleModal from "../AdminModals/ScheduleModals/ViewModal";
import DeleteScheduleModal from "../AdminModals/ScheduleModals/DeleteModal";
import { PrintableScheduleList } from "./PrintableScheduleCalendar";

export default function ScheduleListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [isPrintView, setIsPrintView] = useState(false);
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  
  const pageSize = 10;

  // ── DATA QUERIES ─────────────────────────────────────────────────────
  const { scheduleQuery, createSchedules, updateSchedules, deleteSchedules } = useSchedules();
  const { roomQuery } = useRooms();
  const { teacherQuery } = useTeachers();
  const { subjectQuery } = useSubjects();

  const schedules: Schedule[] = useMemo(
    () => (Array.isArray(scheduleQuery.data) ? scheduleQuery.data : []),
    [scheduleQuery.data]
  );

  const rooms: Room[] = useMemo(() => roomQuery.data ?? [], [roomQuery.data]);
  const teachers: Teacher[] = useMemo(() => teacherQuery.data ?? [], [teacherQuery.data]);
  const subjects: Subject[] = useMemo(() => subjectQuery.data ?? [], [subjectQuery.data]);

  const isLoading =
    scheduleQuery.isLoading ||
    roomQuery.isLoading ||
    teacherQuery.isLoading ||
    subjectQuery.isLoading;

  // ── FILTER OPTIONS ───────────────────────────────────────────────────
  const teacherOptions = useMemo(
    () =>
      teachers
        .map((t) => ({
          value: t.userId,
          label: `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim() || t.userId,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [teachers]
  );

  const roomOptions = useMemo(
    () =>
      rooms
        .map((r) => ({ value: r.roomId, label: r.roomCode ?? r.roomId }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [rooms]
  );

  const subjectOptions = useMemo(
    () =>
      subjects
        .map((s) => ({ value: s.subjectId, label: `${s.code} - ${s.name}` }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [subjects]
  );

  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as const;

  // ── FILTER LOGIC ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return schedules.filter((s) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        [
          s.subjectName ?? s.subjectId,
          s.teacherName ?? s.teacherId,
          s.roomName ?? s.roomId,
          s.sectionName ?? s.sectionId,
          s.dayOfWeek,
          s.startTime,
          s.endTime,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchLower);

      const matchesTeacher =
        filterTeacher === "" || (s.teacherName ?? s.teacherId) === filterTeacher;
      const matchesRoom =
        filterRoom === "" || (s.roomName ?? s.roomId) === filterRoom;
      const matchesDay = filterDay === "" || s.dayOfWeek === filterDay;
      const matchesSubject =
        filterSubject === "" || (s.subjectName ?? s.subjectId) === filterSubject;

      return (
        matchesSearch &&
        matchesTeacher &&
        matchesRoom &&
        matchesDay &&
        matchesSubject
      );
    });
  }, [
    schedules,
    search,
    filterTeacher,
    filterRoom,
    filterDay,
    filterSubject,
  ]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterTeacher("");
    setFilterRoom("");
    setFilterDay("");
    setFilterSubject("");
    setCurrentPage(1);
  };

  // ── HANDLE ADD ───────────────────────────────────────────────────────
  const handleAddSchedule = async (data: {
    subjectId: string;
    sectionId: string;
    roomId: string;
    teacherId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }) => {
    await createSchedules.mutateAsync(data);
    setAddModalOpen(false);
  };

  // ── HANDLE UPDATE ────────────────────────────────────────────────────
  const handleUpdateSchedule = async (
    scheduleId: string,
    data: {
      subjectId?: string;
      sectionId?: string;
      roomId?: string;
      teacherId?: string;
      dayOfWeek?: DayOfWeek;
      startTime?: string;
      endTime?: string;
    }
  ) => {
    await updateSchedules.mutateAsync({ scheduleId, schedule: data });
    setUpdateModalOpen(false);
    setSelectedSchedule(null);
  };

  // ── HANDLE VIEW ──────────────────────────────────────────────────────
  const handleView = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setViewModalOpen(true);
  };

  // ── HANDLE EDIT ──────────────────────────────────────────────────────
  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setUpdateModalOpen(true);
  };

  // ── HANDLE DELETE (Open Modal) ──────────────────────────────────────
  const handleDeleteClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setDeleteModalOpen(true);
  };

  // ── HANDLE DELETE (Confirm) ─────────────────────────────────────────
  const handleDeleteConfirm = async (scheduleId: string) => {
    await deleteSchedules.mutateAsync(scheduleId);
    setDeleteModalOpen(false);
    setSelectedSchedule(null);
  };

  // ── HANDLE EDIT FROM VIEW ───────────────────────────────────────────
  const handleEditFromView = () => {
    setViewModalOpen(false);
    setUpdateModalOpen(true);
  };

  const handlePrint = () => {
  setIsPrintView(true);
  setTimeout(() => {
    window.print();
    setIsPrintView(false);
  }, 100);
};

// ── HANDLE PRINT SCHEDULES ───────────────────────────────────────────
const getFilterLabel = (type: string, value: string) => {
  if (!value) return "";
  switch (type) {
    case "subject":
      return subjectOptions.find(o => o.value === value)?.label || value;
    case "teacher":
      return teacherOptions.find(o => o.value === value)?.label || value;
    case "room":
      return roomOptions.find(o => o.value === value)?.label || value;
    default:
      return value;
  }
};

  // ── RENDER ───────────────────────────────────────────────────────────
  return (
    <>
      {/* HEADER */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full sm:max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* <Button
            onClick={() => setAddModalOpen(true)}
            disabled={isLoading}
            className="w-full sm:w-auto rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition whitespace-nowrap disabled:opacity-50"
          >
            + Add Schedule
          </Button> */}

          <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            disabled={isLoading || filtered.length === 0}
            className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            Print List
          </Button>
          
          <Button
            onClick={() => setAddModalOpen(true)}
            disabled={isLoading}
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition disabled:opacity-50"
          >
            + Add Schedule
          </Button>
        </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={filterSubject}
            onChange={(e) => {
              setFilterSubject(e.target.value);
              setCurrentPage(1);
            }}
            disabled={isLoading}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          >
            <option value="">All Subjects</option>
            {subjectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filterTeacher}
            onChange={(e) => {
              setFilterTeacher(e.target.value);
              setCurrentPage(1);
            }}
            disabled={isLoading}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          >
            <option value="">All Teachers</option>
            {teacherOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filterRoom}
            onChange={(e) => {
              setFilterRoom(e.target.value);
              setCurrentPage(1);
            }}
            disabled={isLoading}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white disabled:opacity-50"
          >
            <option value="">All Rooms</option>
            {roomOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={filterDay}
            onChange={(e) => {
              setFilterDay(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Days</option>
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/5 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.03]">
                <TableRow className="dark:text-white bg-gray-700 dark:bg-gray-700">
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Subject
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Teacher
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Room
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Section
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Day
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Time
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Created
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-xs font-medium text-gray-100 dark:text-gray-300">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex items-center justify-center gap-2">
                        <Spinner size="xl" color="text-brand-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Loading schedules...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      No schedules found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((sched) => (
                    <TableRow
                      key={sched.scheduleId}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition"
                    >
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white">
                        {sched.subjectName ?? sched.subjectId}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white">
                        {sched.teacherName ?? sched.teacherId}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white">
                        {sched.roomName ?? sched.roomId}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-800 dark:text-white">
                        {sched.sectionName ?? sched.sectionId}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Badge size="sm" color="info">
                          {sched.dayOfWeek}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {sched.startTime.slice(0, 5)} – {sched.endTime.slice(0, 5)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(sched.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                          <button
                            title="View"
                            aria-label="View"
                            onClick={() => handleView(sched)}
                            className="hover:text-blue-600 transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            title="Edit"
                            aria-label="Edit"
                            onClick={() => handleEdit(sched)}
                            className="hover:text-yellow-500 transition-colors"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => handleDeleteClick(sched)}
                            className="hover:text-red-500 transition-colors"
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

      {/* PAGINATION */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {isPrintView && (
        <PrintableScheduleList
          schedules={filtered}
          filters={{
            search,
            subject: getFilterLabel("subject", filterSubject),
            teacher: getFilterLabel("teacher", filterTeacher),
            room: getFilterLabel("room", filterRoom),
            day: filterDay,
          }}
        />
)}

      {/* MODALS */}
      <AddScheduleModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddSchedule}
        isLoading={createSchedules.isPending}
      />

      <UpdateScheduleModal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedSchedule(null);
        }}
        onUpdate={handleUpdateSchedule}
        schedule={selectedSchedule}
        isLoading={updateSchedules.isPending}
      />

      <ViewScheduleModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedSchedule(null);
        }}
        onEdit={handleEditFromView}
        schedule={selectedSchedule}
      />

      <DeleteScheduleModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
}