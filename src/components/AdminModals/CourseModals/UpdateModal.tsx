"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Course } from "@/services/courseService";
import { Department } from "@/services/departmentService";
import { 
  Save, 
  X, 
  Building2, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText 
} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface UpdateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  departments: Department[];
  onUpdate: (courseId: string, course: Partial<Course>) => void;
  isLoading?: boolean;
}

export default function UpdateCourseModal({ 
  isOpen, 
  onClose, 
  course, 
  departments,
  onUpdate,
  // isLoading = false 
}: UpdateCourseModalProps) {
  const [formData, setFormData] = useState<{
    courseCode: string;
    title: string;
    departmentId: string;
    status: "ACTIVE" | "INACTIVE";
    description: string;
  }>({
    courseCode: "",
    title: "",
    departmentId: "",
    status: "ACTIVE",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Load course data with validation
  useEffect(() => {
    if (course && isOpen) {
      setFormData({
        courseCode: course.courseCode || "",
        title: course.title || "",
        departmentId: course.departmentId || "",
        status: course.status || "ACTIVE",
        description: course.description || "",
      });
      setErrors({});
    }
  }, [course, isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector('input[name="courseCode"]') as HTMLInputElement;
      firstInput?.focus();
    }
  }, [isOpen]);

  // Enhanced validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Course title is required";
    }
    
    if (!formData.departmentId) {
      newErrors.departmentId = "Please select a department";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes with debounced validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Enhanced toggle with keyboard support
  const toggleStatus = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e && e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter' && (e as React.KeyboardEvent).key !== ' ') {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    }));
  };

  // Enhanced submit with loading states
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!course) return;

    setIsSubmitting(true);
    try {
      await onUpdate(course.courseId, formData);
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      setErrors({ submit: "Failed to update course. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!course) return null;

  const isActive = formData.status === "ACTIVE";
  const selectedDepartment = departments.find(dept => dept.departmentId === formData.departmentId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="update-course-modal-title"
    >
      {/* Header with gradient background - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm flex-shrink-0">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2
                id="update-course-modal-title"
                className="text-xl sm:text-2xl font-bold truncate"
              >
                Update Course
              </h2>
              <p className="text-sm sm:text-base text-blue-100 mt-1">
                {course.courseCode} - {course.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content - Form Cards */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Basic Information and Status */}
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Information Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h3>
              </div>

              {/* Status Badge - Read-only preview */}
              <div className="mb-4">
                <Badge
                  size="sm"
                  color={isActive ? "success" : "error"}
                >
                  {isActive ? (
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  )}
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-4">
                {/* Course Code */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="courseCode"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                  >
                    Course Code
                  </Label>
                  <Input
                    id="courseCode"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    placeholder="CS-101"
                    className={`
                      w-full px-3 py-2.5 border rounded-lg text-sm
                      transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${errors.courseCode 
                        ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                        : "border-gray-200 hover:border-gray-300 bg-white dark:bg-white/5"
                      }
                    `}
                    aria-invalid={!!errors.courseCode}
                    aria-describedby={errors.courseCode ? "courseCode-error" : undefined}
                  />
                  {errors.courseCode && (
                    <p id="courseCode-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.courseCode}
                    </p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="title"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                  >
                    Course Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Introduction to Computer Science"
                    className={`
                      w-full px-3 py-2.5 border rounded-lg text-sm
                      transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${errors.title 
                        ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                        : "border-gray-200 hover:border-gray-300 bg-white dark:bg-white/5"
                      }
                    `}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? "title-error" : undefined}
                  />
                  {errors.title && (
                    <p id="title-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label 
                    htmlFor="departmentId"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                  >
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    Department
                  </Label>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
                       dark:text-gray-300
                      bg-white dark:bg-white/5 transition-colors duration-150
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${errors.departmentId 
                        ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                        : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                    aria-invalid={!!errors.departmentId}
                    aria-describedby={errors.departmentId ? "departmentId-error" : undefined}
                  >
                    <option value="">Select a department</option>
                    {departments.map(dept => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <p id="departmentId-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {errors.departmentId}
                    </p>
                  )}
                  {selectedDepartment && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {selectedDepartment.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Toggle Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Course Status
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {isActive ? "Active Course" : "Inactive Course"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isActive 
                        ? "This course is currently available to students" 
                        : "This course is currently unavailable to students"
                      }
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleStatus}
                    onKeyDown={toggleStatus}
                    className={`
                      relative inline-flex items-center h-10 w-20 rounded-full
                      transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-${isActive ? 'green' : 'gray'}-500
                      ${isActive 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-200/50' 
                        : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700'
                      }
                    `}
                    aria-label={`Toggle to ${isActive ? 'inactive' : 'active'}`}
                    aria-pressed={!isActive}
                  >
                    <span
                      className={`
                        absolute inset-0 flex items-center justify-center
                        transition-all duration-300 ease-out rounded-full
                        ${isActive 
                          ? 'text-green-100 font-semibold text-xs' 
                          : 'text-gray-600 dark:text-gray-400 font-medium text-xs'
                        }
                      `}
                    >
                      {isActive ? 'ON' : 'OFF'}
                    </span>
                    <span
                      className={`
                        relative inline-block w-7 h-7 bg-white rounded-full shadow-lg
                        transform transition-transform duration-300 ease-out
                        ${isActive ? 'translate-x-10 shadow-green-300/50' : 'translate-x-1 shadow-gray-300/50'}
                      `}
                    >
                      {isActive ? (
                        <ToggleRight className="w-4 h-4 text-green-600 ml-0.5 absolute inset-0 m-auto" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-gray-400 mr-0.5 absolute inset-0 m-auto" />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Description Card */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Course Description
              </h3>
            </div>

            <div className="space-y-3">
              {/* Editable Textarea */}
              <div className="space-y-2">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter course description..."
                  rows={8}
                  className={`
                    w-full px-3 py-2.5 border rounded-lg text-sm resize-vertical
                     dark:text-gray-300
                    transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    bg-white dark:bg-white/5 border-gray-200 hover:border-gray-300
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                  `}
                  aria-describedby="description-help"
                />
                <p id="description-help" className="text-xs text-gray-500 dark:text-gray-400">
                  Provide a detailed overview of the course content and objectives (optional)
                </p>
              </div>

              {/* Live Preview - Separated for clarity */}
              {formData.description && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Preview
                  </p>
                  <div className="max-h-40 overflow-y-auto pr-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {formData.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="mt-4 sm:mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* Footer - Responsive */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
            Updating {course.courseCode}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
              aria-label="Cancel update"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Cancel
            </Button>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.courseCode || !formData.title || !formData.departmentId}
              className={`
                rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium
                flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center
                ${isSubmitting || !formData.courseCode || !formData.title || !formData.departmentId
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
                }
                transition-all duration-150 focus:ring-blue-500
              `}
              aria-label="Update course details"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}