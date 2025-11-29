"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Section } from "@/services/sectionService";
import { 
  X, 
  Users, 
  Hash,
  Text,
  Calendar,
  GraduationCap,
  BookOpen,
  UserCheck,
  Clock,
  Building2
} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface ViewSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section | null;
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export default function ViewSectionModal({ 
  isOpen, 
  onClose, 
  section,
  isLoading = false
}: ViewSectionModalProps) {
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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'error';
      case 'FULL':
        return 'warning';
      default:
        return 'primary';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'FULL':
        return 'Full';
      default:
        return status;
    }
  };

  if (!section) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="view-section-modal-title"
    >
      <div className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
        {/* Header with gradient background - Sticky on mobile */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2
                  id="view-section-modal-title"
                  className="text-xl font-bold truncate"
                >
                  View Section
                </h2>
                <p className="text-sm text-blue-100 mt-1 truncate">
                  {section.code} - {section.name}
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
                {/* Section Information Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Section Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div>
                      <Badge
                        size="sm"
                        color={getStatusColor(section.status)}
                      >
                        {getStatusText(section.status)}
                      </Badge>
                    </div>

                    {/* Section Code */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3 flex-shrink-0" />
                        Section Code
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {section.code}
                      </div>
                    </div>

                    {/* Section Name */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Text className="w-3 h-3 flex-shrink-0" />
                        Section Name
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {section.name}
                      </div>
                    </div>

                    {/* Year Level */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1"
                      >
                        <GraduationCap className="w-3 h-3 flex-shrink-0" />
                        Year Level
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {section.yearLevel}{section.yearLevel === 1 ? 'st' : section.yearLevel === 2 ? 'nd' : section.yearLevel === 3 ? 'rd' : 'th'} Year
                      </div>
                    </div>

                    {/* Max Students */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3 flex-shrink-0" />
                        Maximum Students
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {section.maxStudents} students
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Information Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Course Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Course */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        Course
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {section.courseTitle}
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
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {section.semesterName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Metadata and Status */}
              <div className="space-y-4 sm:space-y-6">
                {/* Status Details Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Status Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Current Status */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Current Status
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge
                          size="sm"
                          color={getStatusColor(section.status)}
                        >
                          {getStatusText(section.status)}
                        </Badge>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {section.status === 'ACTIVE' && 'Section is currently active and accepting students'}
                          {section.status === 'INACTIVE' && 'Section is currently inactive'}
                          {section.status === 'FULL' && 'Section has reached maximum capacity'}
                        </p>
                      </div>
                    </div>

                    {/* Capacity Information */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Capacity
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Maximum Students:</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{section.maxStudents}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              section.status === 'FULL' 
                                ? 'bg-red-500' 
                                : section.maxStudents > 40 
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{ width: section.status === 'FULL' ? '100%' : '50%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metadata Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Metadata
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Created At */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Created At
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(section.createdAt)}
                      </p>
                    </div>

                    {/* Updated At */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Last Updated
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(section.updatedAt)}
                      </p>
                    </div>

                    {/* Section ID */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Section ID
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {section.sectionId}
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
              {section.courseTitle} • {section.semesterName}
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