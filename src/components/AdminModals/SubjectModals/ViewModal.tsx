"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Subject } from "@/services/subjectService";
import { 
  X, 
  BookOpen, 
  Hash,
  Text,
  List,
  Calendar,
  GraduationCap,
  Type,
  Clock,
  FileText,
  Users,
  Eye,

} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface ViewSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: Subject | null;
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export default function ViewSubjectsModal({ 
  isOpen, 
  onClose, 
  subject,
  isLoading = false
}: ViewSubjectsModalProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!subject) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="view-subject-modal-title"
    >
      <div className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
        {/* Header with gradient background - Sticky on mobile */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2
                  id="view-subject-modal-title"
                  className="text-xl font-bold truncate"
                >
                  View Subject
                </h2>
                <p className="text-sm text-blue-100 mt-1 truncate">
                  {subject.code} - {subject.name}
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

        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6">
          <div className="py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column - Basic Information */}
              <div className="space-y-4 sm:space-y-6">
                {/* Basic Information Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div>
                      <Badge
                        size="sm"
                        color={subject.isActive ? "success" : "error"}
                      >
                        {subject.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {/* Subject Code */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3 flex-shrink-0" />
                        Subject Code
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {subject.code}
                      </div>
                    </div>

                    {/* Subject Name */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Text className="w-3 h-3 flex-shrink-0" />
                        Subject Name
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white  dark:text-gray-200 dark:bg-white/5 border-gray-200 dark:border-gray-700">
                        {subject.name}
                      </div>
                    </div>

                    {/* Credit Units */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3 flex-shrink-0" />
                        Credit Units
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5  dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {subject.creditUnits}
                      </div>
                    </div>

                    {/* Year Level */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <GraduationCap className="w-3 h-3 flex-shrink-0" />
                        Year Level
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5  dark:text-gray-200   border-gray-200 dark:border-gray-700">
                        {subject.yearLevel}{subject.yearLevel === 1 ? 'st' : subject.yearLevel === 2 ? 'nd' : subject.yearLevel === 3 ? 'rd' : 'th'} Year
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course and Semester Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <List className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Course & Semester
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Course */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3 flex-shrink-0" />
                        Course
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5  dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {subject.courseTitle}
                      </div>
                    </div>

                    {/* Semester */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        Semester
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5  dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {subject.semesterName}
                      </div>
                    </div>

                    {/* Subject Type */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Type className="w-3 h-3 flex-shrink-0" />
                        Subject Type
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {subject.type === "LEC" ? "Lecture" : 
                         subject.type === "LAB" ? "Laboratory" : 
                         "Lecture & Laboratory"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Description and Settings */}
              <div className="space-y-4 sm:space-y-6">
                {/* Description Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Description
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5  dark:text-gray-200 border-gray-200 dark:border-gray-700 min-h-[120px]">
                      {subject.description || (
                        <p className="text-gray-400 dark:text-gray-500 italic">No description provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Settings Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Settings & Metadata
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Shared Status */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Shared Subject
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {subject.isShared 
                            ? "This subject can be used by other courses" 
                            : "This subject is exclusive to this course"
                          }
                        </p>
                      </div>
                      <div className={`
                        relative inline-flex items-center h-6 w-11 rounded-full flex-shrink-0
                        ${subject.isShared ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}
                      `}>
                        <span
                          className={`
                            inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-300 ease-out
                            ${subject.isShared ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Active Status
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {subject.isActive 
                            ? "This subject is currently active" 
                            : "This subject is currently inactive"
                          }
                        </p>
                      </div>
                      <div className={`
                        relative inline-flex items-center h-6 w-11 rounded-full flex-shrink-0
                        ${subject.isActive ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'}
                      `}>
                        <span
                          className={`
                            inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-300 ease-out
                            ${subject.isActive ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </div>
                    </div>

                    {/* Created At */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Created At
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(subject.createdAt)}
                      </p>
                    </div>

                    {/* Updated At */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Last Updated
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(subject.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sticky on mobile */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-10 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
              Subject ID: {subject.subjectId}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
          
         
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
                aria-label="Close modal"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}