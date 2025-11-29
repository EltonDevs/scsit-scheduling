"use client";

import React, { useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

import {
  X,
  Clock,
  Calendar,
  BookOpen,
  GraduationCap,
  MapPin,
  Users,
  Edit,
} from "lucide-react";

import type { Schedule } from "@/types/Schedule";

interface ViewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  schedule: Schedule | null;
}

export default function ViewScheduleModal({
  isOpen,
  onClose,
  onEdit,
  schedule,
}: ViewScheduleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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
      aria-labelledby="view-schedule-modal-title"
    >
      <div ref={modalRef} className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2 id="view-schedule-modal-title" className="text-xl font-bold truncate">
                  Schedule Details
                </h2>
                <p className="text-sm text-indigo-100 mt-1 truncate">
                  View schedule information
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
          <div className="py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Subject & Section */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Class Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Subject */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Subject
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {schedule.subjectName || schedule.subjectId}
                      </div>
                    </div>

                    {/* Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Section
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {schedule.sectionName || schedule.sectionId}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher & Room */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Assignment
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Teacher */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Teacher
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {schedule.teacherName || schedule.teacherId}
                      </div>
                    </div>

                    {/* Room */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Room
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {schedule.roomName || schedule.roomId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                {/* Time & Day */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Schedule
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Day */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Day of Week
                      </label>
                      <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {schedule.dayOfWeek}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Start Time
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                          {schedule.startTime.slice(0, 5)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          End Time
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                          {schedule.endTime.slice(0, 5)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(schedule.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {schedule.updatedAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Updated</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(schedule.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Schedule ID</span>
                      <span className="text-xs font-mono text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {schedule.scheduleId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-10 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
              View only mode
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onClose}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Close
              </Button>
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50 transition-all duration-150 focus:ring-indigo-500"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Edit Schedule
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}