/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

import { useSubjects } from "@/hooks/useSubjects";
import { useTeachers } from "@/hooks/useTeacher";
import { useRooms } from "@/hooks/useRoom";
import { useSections } from "@/hooks/useSection";

import {
  Save,
  X,
  Clock,
  AlertCircle,
  Calendar,
  BookOpen,
  GraduationCap,
  MapPin,
  Users,
} from "lucide-react";

import type { DayOfWeek, Schedule } from "@/types/Schedule";

interface UpdateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (scheduleId: string, data: {
    subjectId?: string;
    sectionId?: string;
    roomId?: string;
    teacherId?: string;
    dayOfWeek?: DayOfWeek;
    startTime?: string;
    endTime?: string;
  }) => void;
  schedule: Schedule | null;
  isLoading?: boolean;
}

export default function UpdateScheduleModal({
  isOpen,
  onClose,
  onUpdate,
  schedule,
  isLoading = false,
}: UpdateScheduleModalProps) {
  // ── FORM STATE ─────────────────────────────────────────────────────
  const [formData, setFormData] = useState<{
    subjectId: string;
    sectionId: string;
    roomId: string;
    teacherId: string;
    dayOfWeek: DayOfWeek | "";
    startTime: string;
    endTime: string;
  }>({
    subjectId: "",
    sectionId: "",
    roomId: "",
    teacherId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // ── DATA QUERIES ───────────────────────────────────────────────────
  const { subjectQuery } = useSubjects();
  const { teacherQuery } = useTeachers();
  const { roomQuery } = useRooms();
  const { sectionQuery } = useSections();

  const subjects = subjectQuery.data ?? [];
  const teachers = teacherQuery.data ?? [];
  const rooms = roomQuery.data ?? [];
  const sections = sectionQuery.data ?? [];

  const isDataLoading =
    subjectQuery.isLoading ||
    teacherQuery.isLoading ||
    roomQuery.isLoading ||
    sectionQuery.isLoading;

  // ── POPULATE FORM WITH SCHEDULE DATA ────────────────────────────────
  useEffect(() => {
    if (isOpen && schedule) {
      setFormData({
        subjectId: schedule.subjectId || "",
        sectionId: schedule.sectionId || "",
        roomId: schedule.roomId || "",
        teacherId: schedule.teacherId || "",
        dayOfWeek: schedule.dayOfWeek || "",
        startTime: schedule.startTime?.slice(0, 5) || "", // Remove seconds
        endTime: schedule.endTime?.slice(0, 5) || "",
      });
      setErrors({});
    }
  }, [isOpen, schedule]);

  // ── FOCUS FIRST INPUT ───────────────────────────────────────────────
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector(
        'select[name="subjectId"]'
      ) as HTMLSelectElement;
      firstInput?.focus();
    }
  }, [isOpen]);

  // ── VALIDATION ─────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subjectId) newErrors.subjectId = "Subject is required";
    if (!formData.sectionId) newErrors.sectionId = "Section is required";
    if (!formData.roomId) newErrors.roomId = "Room is required";
    if (!formData.teacherId) newErrors.teacherId = "Teacher is required";
    if (!formData.dayOfWeek) newErrors.dayOfWeek = "Day is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    // Time order validation
    if (formData.startTime && formData.endTime) {
      const [sh, sm] = formData.startTime.split(":").map(Number);
      const [eh, em] = formData.endTime.split(":").map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      if (end <= start) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── HANDLE CHANGE ───────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── HANDLE SUBMIT ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !schedule) return;

    const validDays: DayOfWeek[] = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];

    if (!validDays.includes(formData.dayOfWeek as DayOfWeek)) {
      setErrors({ dayOfWeek: "Please select a valid day" });
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(schedule.scheduleId, {
        subjectId: formData.subjectId,
        sectionId: formData.sectionId,
        roomId: formData.roomId,
        teacherId: formData.teacherId,
        dayOfWeek: formData.dayOfWeek as DayOfWeek,
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`,
      });
      onClose();
    } catch (err: any) {
      setErrors({
        submit: err.message || "Failed to update schedule. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── ESCAPE TO CLOSE ─────────────────────────────────────────────────
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!schedule) return null;

  // ── RENDER ───────────────────────────────────────────────────────────
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="update-schedule-modal-title"
    >
      <div ref={modalRef} className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-700 dark:from-yellow-800 dark:to-orange-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2 id="update-schedule-modal-title" className="text-xl font-bold truncate">
                  Update Schedule
                </h2>
                <p className="text-sm text-yellow-100 mt-1 truncate">
                  Modify schedule details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/30 flex-shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Subject & Section */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Class Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subjectId" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Subject
                      </Label>
                      <select
                        id="subjectId"
                        name="subjectId"
                        value={formData.subjectId}
                        onChange={handleChange}
                        disabled={isDataLoading}
                        className={`
                          text-gray-800 dark:text-gray-200 w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
                          bg-white dark:bg-white/5 transition-colors
                          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                          ${errors.subjectId ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 hover:border-gray-300"}
                        `}
                      >
                        <option value="">Select subject</option>
                        {subjects.map((s) => (
                          <option key={s.subjectId} value={s.subjectId}>
                            {s.code} - {s.name}
                          </option>
                        ))}
                      </select>
                      {errors.subjectId && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.subjectId}
                        </p>
                      )}
                    </div>

                    {/* Section */}
                    <div className="space-y-2">
                      <Label htmlFor="sectionId" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Section
                      </Label>
                      <select
                        id="sectionId"
                        name="sectionId"
                        value={formData.sectionId}
                        onChange={handleChange}
                        disabled={isDataLoading}
                        className={`
                          text-gray-800 dark:text-gray-200 w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
                          bg-white dark:bg-white/5 transition-colors
                          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                          ${errors.sectionId ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 hover:border-gray-300"}
                        `}
                      >
                        <option value="">Select section</option>
                        {sections.map((sec) => (
                          <option key={sec.sectionId} value={sec.sectionId}>
                            {sec.name}
                          </option>
                        ))}
                      </select>
                      {errors.sectionId && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.sectionId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Teacher & Room */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Assignment
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Teacher */}
                    <div className="space-y-2">
                      <Label htmlFor="teacherId" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Teacher
                      </Label>
                      <select
                        id="teacherId"
                        name="teacherId"
                        value={formData.teacherId}
                        onChange={handleChange}
                        disabled={isDataLoading}
                        className={`
                          text-gray-800 dark:text-gray-200 w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
                          bg-white dark:bg-white/5 transition-colors
                          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                          ${errors.teacherId ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 hover:border-gray-300"}
                        `}
                      >
                        <option value="">Select teacher</option>
                        {teachers.map((t) => (
                          <option key={t.userId} value={t.userId}>
                            {t.firstName} {t.lastName}
                          </option>
                        ))}
                      </select>
                      {errors.teacherId && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.teacherId}
                        </p>
                      )}
                    </div>

                    {/* Room */}
                    <div className="space-y-2">
                      <Label htmlFor="roomId" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Room
                      </Label>
                      <select
                        id="roomId"
                        name="roomId"
                        value={formData.roomId}
                        onChange={handleChange}
                        disabled={isDataLoading}
                        className={`
                          text-gray-800 dark:text-gray-200 w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
                          bg-white dark:bg-white/5 transition-colors
                          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                          ${errors.roomId ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 hover:border-gray-300"}
                        `}
                      >
                        <option value="">Select room</option>
                        {rooms.map((r) => (
                          <option key={r.roomId} value={r.roomId}>
                            {r.roomCode} - {r.building}
                          </option>
                        ))}
                      </select>
                      {errors.roomId && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.roomId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Time & Day */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Schedule
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Day */}
                    <div className="space-y-2">
                      <Label htmlFor="dayOfWeek" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Day of Week
                      </Label>
                      <select
                        id="dayOfWeek"
                        name="dayOfWeek"
                        value={formData.dayOfWeek}
                        onChange={handleChange}
                        className={`
                          text-gray-800 dark:text-gray-200 w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
                          bg-white dark:bg-white/5 transition-colors
                          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2
                          ${errors.dayOfWeek ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 hover:border-gray-300"}
                        `}
                      >
                        <option value="">Select day</option>
                        {(
                          [
                            "MONDAY",
                            "TUESDAY",
                            "WEDNESDAY",
                            "THURSDAY",
                            "FRIDAY",
                            "SATURDAY",
                          ] as const
                        ).map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      {errors.dayOfWeek && (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.dayOfWeek}
                        </p>
                      )}
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Start Time
                        </Label>
                        <Input
                          type="time"
                          id="startTime"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className={`
                            text-gray-800 dark:text-gray-200 w-full px-3 py-2.5 border rounded-lg text-sm
                            bg-white dark:bg-white/5
                            ${errors.startTime ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 hover:border-gray-300"}
                          `}
                        />
                        {errors.startTime && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.startTime}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          End Time
                        </Label>
                        <Input
                          type="time"
                          id="endTime"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className={`
                            text-gray-800 dark:text-gray-200 w-full px-3 py-2.5 border rounded-lg text-sm
                            bg-white dark:bg-white/5
                            ${errors.endTime ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" : "border-gray-200 hover:border-gray-300"}
                          `}
                        />
                        {errors.endTime && (
                          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.endTime}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-10 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
              Updating schedule
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || isLoading}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Cancel
              </Button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting || isLoading || isDataLoading}
                className={`
                  rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium
                  flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center
                  ${(isSubmitting || isLoading || isDataLoading)
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-700 hover:to-orange-800 text-white shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/50"
                  }
                  transition-all duration-150 focus:ring-yellow-500
                `}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Update Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}