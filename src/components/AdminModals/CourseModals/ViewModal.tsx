"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Course } from "@/data/all-data-context";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Building2, 
  FileText, 
  CheckCircle2,
  XCircle,
  Edit3
} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onEdit?: () => void;
}

export default function ViewCourseModal({ isOpen, onClose, course, onEdit }: ViewCourseModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (years?: number | null) => {
    if (!years || years === 0) return "Not specified";
    return years === 1 ? `${years} year` : `${years} years`;
  };

  if (!course) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="view-course-modal-title"
    >
      {/* Header with gradient background - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <h2
                id="view-course-modal-title"
                className="text-xl sm:text-2xl font-bold truncate"
                title={course.courseCode}
              >
                {course.courseCode}
              </h2>
              <p 
                className="text-sm sm:text-lg text-blue-100 mt-1 line-clamp-2"
                title={course.title}
              >
                {course.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Responsive */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h3>
                </div>
                
                {/* Status Badge */}
                <Badge
                  size="sm"
                  color={course.status === "ACTIVE" ? "success" : "error"}
                
                >
                  {course.status === "ACTIVE" ? (
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  )}
                  {course.status}
                </Badge>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
                    Department
                  </Label>
                  <div className="flex items-center gap-2 text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="truncate" title={course.departmentName}>
                      {course.departmentName}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    Duration
                  </Label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                    {formatDuration(course.durationYears)}
                  </p>
                </div>

                {/* Additional info fields */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
                      Course Level
                    </Label>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                      Undergraduate
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Timeline
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Created</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-right">
                    {formatDate(course.createdAt)}
                  </span>
                </div>

                {course.updatedAt && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Updated</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-right">
                      {formatDate(course.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Description Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Course Description
                </h3>
              </div>

              <div className="max-h-40 sm:max-h-64 overflow-y-auto pr-2">
                {course.description ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {course.description}
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 sm:py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 mb-2 opacity-50" />
                    <p className="italic text-sm sm:text-base">No description available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Responsive */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
          Last updated: {course.updatedAt ? formatDate(course.updatedAt) : formatDate(course.createdAt)}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
          {onEdit && (
            <Button
              size="sm"
              variant="primary"
              onClick={onEdit}
              className="rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center"
              aria-label="Edit course details"
            >
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
            aria-label="Close course details modal"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}