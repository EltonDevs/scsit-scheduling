"use client";

import React, { useState, useMemo } from "react";
import { Printer } from "lucide-react";
import { useSchedules } from "@/hooks/useSchedules";
import { useRooms } from "@/hooks/useRoom";
import { useTeachers } from "@/hooks/useTeacher";
import { useSubjects } from "@/hooks/useSubjects";

import type { Schedule, DayOfWeek } from "@/types/Schedule";
import type { Room } from "@/services/roomService";
import type { Teacher } from "@/services/teacherService";
import type { Subject } from "@/services/subjectService";

import ScheduleCalendarView from "./ScheduleCalendarView";
import ViewScheduleModal from "../AdminModals/ScheduleModals/ViewModal";
import UpdateScheduleModal from "../AdminModals/ScheduleModals/UpdateModal";
import DeleteScheduleModal from "../AdminModals/ScheduleModals/DeleteModal";

import Button from "@/components/ui/button/Button";
import { PrintableScheduleCalendar } from "./PrintableScheduleCalendar";

export default function ScheduleCalendarPage() {
  const [search, setSearch] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterRoom, setFilterRoom] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [isPrintView, setIsPrintView] = useState(false);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  // ── DATA QUERIES ─────────────────────────────────────────────────────
  const { scheduleQuery, updateSchedules, deleteSchedules } = useSchedules();
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
        filterTeacher === "" || s.teacherId === filterTeacher;
      const matchesRoom =
        filterRoom === "" || s.roomId === filterRoom;
      const matchesDay = filterDay === "" || s.dayOfWeek === filterDay;
      const matchesSubject =
        filterSubject === "" || s.subjectId === filterSubject;

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

  const resetFilters = () => {
    setSearch("");
    setFilterTeacher("");
    setFilterRoom("");
    setFilterDay("");
    setFilterSubject("");
  };

  // ── HANDLE PRINT ─────────────────────────────────────────────────────
  const handlePrint = () => {
    setIsPrintView(true);
    setTimeout(() => {
      window.print();
      setIsPrintView(false);
    }, 100);
  };

  // ── HANDLE VIEW ──────────────────────────────────────────────────────
  const handleView = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setViewModalOpen(true);
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

  // ── HANDLE DELETE ─────────────────────────────────────────────────
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

  // Get filter labels for print
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
      {/* FILTERS */}
      <div className="mb-6 space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <input
            type="text"
            placeholder="Search schedules..."
            className="w-full sm:max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            onClick={handlePrint}
            disabled={isLoading || filtered.length === 0}
            className="flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            Print Calendar
          </Button>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
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
            onChange={(e) => setFilterTeacher(e.target.value)}
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
            onChange={(e) => setFilterRoom(e.target.value)}
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
            onChange={(e) => setFilterDay(e.target.value)}
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

      {/* CALENDAR VIEW */}
      <div className="print:hidden">
        <ScheduleCalendarView
          schedules={filtered}
          isLoading={isLoading}
          onScheduleClick={handleView}
        />
      </div>

      {/* PRINT VIEW */}
      {isPrintView && (
        <PrintableScheduleCalendar
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
      <ViewScheduleModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedSchedule(null);
        }}
        onEdit={handleEditFromView}
        schedule={selectedSchedule}
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