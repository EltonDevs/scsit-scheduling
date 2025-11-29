"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Subject } from "@/services/subjectService";
import { 
  Save, 
  X, 
  BookOpen, 
  AlertCircle,

  Hash,
  Text,
  List,
  Calendar,
  GraduationCap,
  Type,

  Clock
} from "lucide-react";


interface AddSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newSubject: Omit<Subject, "subjectId" | "createdAt" | "updatedAt" | "courseTitle" | "semesterName">) => void;
  isLoading?: boolean;
  courses: { courseId: string; title: string }[];
  semesters: { semesterId: string; name: string }[];
}

export default function AddSubjectsModal({ 
  isOpen, 
  onClose, 
  onAdd,
  // isLoading = false,
  courses,
  semesters
}: AddSubjectsModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    courseId: "",
    creditUnits: 0,
    semesterId: "",
    yearLevel: 1,
    type: "MAJOR",
    isShared: false,
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        code: "",
        name: "",
        description: "",
        courseId: "",
        creditUnits: 0,
        semesterId: "",
        yearLevel: 1,
        type: "MAJOR",
        isShared: false,
        isActive: true
      });
      setErrors({});
    }
  }, [isOpen]);

 
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector('input[name="code"]') as HTMLInputElement;
      firstInput?.focus();
    }
  }, [isOpen]);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code.trim()) {
      newErrors.code = "Subject code is required";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Subject name is required";
    }
    
    if (!formData.courseId) {
      newErrors.courseId = "Please select a course";
    }
    
    if (!formData.semesterId) {
      newErrors.semesterId = "Please select a semester";
    }
    
    if (formData.creditUnits <= 0) {
      newErrors.creditUnits = "Credit units must be greater than 0";
    }
    
    if (formData.yearLevel < 1 || formData.yearLevel > 5) {
      newErrors.yearLevel = "Year level must be between 1 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Toggle boolean fields
  const toggleBooleanField = (field: "isShared" | "isActive") => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAdd(formData);
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ submit: "Failed to add subject. Please try again." });
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="add-subject-modal-title"
    >
      <div ref={modalRef} className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
        {/* Header with gradient background - Sticky on mobile */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2
                  id="add-subject-modal-title"
                  className="text-xl font-bold truncate"
                >
                  Add New Subject
                </h2>
                <p className="text-sm text-blue-100 mt-1 truncate">
                  Create a new subject for the curriculum
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
        <div ref={contentRef} className="overflow-y-auto flex-1 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="py-4">
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
                    {/* Subject Code */}
                    <div className="space-y-2">
                      <Label 
                        htmlFor="code"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3 flex-shrink-0" />
                        Subject Code
                      </Label>
                      <Input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="MATH-101"
                        className={`
                          w-full px-3 py-2.5 border rounded-lg text-sm
                          transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${errors.code 
                            ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                            : "border-gray-200 hover:border-gray-300 bg-white dark:bg-white/5"
                          }
                        `}
                        aria-invalid={!!errors.code}
                        aria-describedby={errors.code ? "code-error" : undefined}
                      />
                      {errors.code && (
                        <p id="code-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errors.code}
                        </p>
                      )}
                    </div>

                    {/* Subject Name */}
                    <div className="space-y-2">
                      <Label 
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Text className="w-3 h-3 flex-shrink-0" />
                        Subject Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Calculus I"
                        className={`
                          w-full px-3 py-2.5 border rounded-lg text-sm
                          transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${errors.name 
                            ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                            : "border-gray-200 hover:border-gray-300 bg-white dark:bg-white/5"
                          }
                        `}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Credit Units */}
                    <div className="space-y-2">
                      <Label 
                        htmlFor="creditUnits"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3 flex-shrink-0" />
                        Credit Units
                      </Label>
                      <Input
                        id="creditUnits"
                        name="creditUnits"
                        type="number"
                        min="0"
                        max="10"
                        value={formData.creditUnits}
                        onChange={handleChange}
                        className={`
                          w-full px-3 py-2.5 border rounded-lg text-sm
                          transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${errors.creditUnits 
                            ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                            : "border-gray-200 hover:border-gray-300 bg-white dark:bg-white/5"
                          }
                        `}
                        aria-invalid={!!errors.creditUnits}
                        aria-describedby={errors.creditUnits ? "creditUnits-error" : undefined}
                      />
                      {errors.creditUnits && (
                        <p id="creditUnits-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errors.creditUnits}
                        </p>
                      )}
                    </div>

                    {/* Year Level */}
                    <div className="space-y-2">
                      <Label 
                        htmlFor="yearLevel"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <GraduationCap className="w-3 h-3 flex-shrink-0" />
                        Year Level
                      </Label>
                      <select
                        id="yearLevel"
                        name="yearLevel"
                        value={formData.yearLevel}
                        onChange={handleChange}
                        className={`
                          w-full px-3 py-2.5 border rounded-lg text-sm appearance-none
                          dark:text-white
                          bg-white dark:bg-white/5 transition-colors duration-150
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${errors.yearLevel 
                            ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                            : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                        aria-invalid={!!errors.yearLevel}
                        aria-describedby={errors.yearLevel ? "yearLevel-error" : undefined}
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                        <option value={5}>5th Year</option>
                      </select>
                      {errors.yearLevel && (
                        <p id="yearLevel-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errors.yearLevel}
                        </p>
                      )}
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
                        htmlFor="courseId"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3 flex-shrink-0" />
                        Course
                      </Label>
                      <select
                        id="courseId"
                        name="courseId"
                        value={formData.courseId}
                        onChange={handleChange}
                        className={`
                          w-full px-3 py-2.5 border rounded-lg text-sm appearance-none dark:text-gray-300
                          bg-white dark:bg-white/5 transition-colors duration-150
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${errors.courseId 
                            ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                            : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                        aria-invalid={!!errors.courseId}
                        aria-describedby={errors.courseId ? "courseId-error" : undefined}
                      >
                        <option value="">Select a course</option>
                        {courses.map(course => (
                          <option key={course.courseId} value={course.courseId}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                      {errors.courseId && (
                        <p id="courseId-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errors.courseId}
                        </p>
                      )}
                    </div>

                    {/* Semester */}
                    <div className="space-y-2">
                      <Label 
                        htmlFor="semesterId"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        Semester
                      </Label>
                      <select
                        id="semesterId"
                        name="semesterId"
                        value={formData.semesterId}
                        onChange={handleChange}
                        className={`
                          w-full px-3 py-2.5 border rounded-lg text-sm appearance-none  dark:text-gray-300
                          bg-white dark:bg-white/5 transition-colors duration-150
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          ${errors.semesterId 
                            ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20" 
                            : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                        aria-invalid={!!errors.semesterId}
                        aria-describedby={errors.semesterId ? "semesterId-error" : undefined}
                      >
                        <option value="">Select a semester</option>
                        {semesters.map(semester => (
                          <option key={semester.semesterId} value={semester.semesterId}>
                            {semester.name}
                          </option>
                        ))}
                      </select>
                      {errors.semesterId && (
                        <p id="semesterId-error" className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {errors.semesterId}
                        </p>
                      )}
                    </div>

                    {/* Subject Type */}
                    <div className="space-y-2">
                      <Label 
                        htmlFor="type"
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Type className="w-3 h-3 flex-shrink-0" />
                        Subject Type
                      </Label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border rounded-lg text-sm appearance-none  dark:text-gray-300
                          bg-white dark:bg-white/5 transition-colors duration-150
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                          border-gray-200 hover:border-gray-300"
                      >
                        <option value="MAJOR">MAJOR</option>
                        <option value="MINOR">MINOR</option>
                         <option value="LAB">LAB</option>
                        <option value="SEMINAR">SEMINAR</option>
                       
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Description and Settings */}
              <div className="space-y-4 sm:space-y-6">
                {/* Description Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Text className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-200 dark:text-white">
                      Description
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter subject description..."
                      rows={8}
                      className="w-full px-3 py-2.5 border rounded-lg text-sm resize-vertical
                       dark:text-white
                        transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        bg-white dark:bg-white/5 border-gray-200 hover:border-gray-300
                        placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Settings Card */}
                <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Settings
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Shared Status */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Shared Subject
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formData.isShared 
                            ? "This subject can be used by other courses" 
                            : "This subject is exclusive to this course"
                          }
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBooleanField("isShared")}
                        className={`
                          relative inline-flex items-center h-6 w-11 rounded-full
                          transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          ${formData.isShared 
                            ? 'bg-blue-600' 
                            : 'bg-gray-200 dark:bg-gray-600'
                          }
                        `}
                        aria-label="Toggle shared status"
                        aria-pressed={formData.isShared}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-300 ease-out
                            ${formData.isShared ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Active Status
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formData.isActive 
                            ? "This subject is currently active" 
                            : "This subject is currently inactive"
                          }
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBooleanField("isActive")}
                        className={`
                          relative inline-flex items-center h-6 w-11 rounded-full
                          transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          ${formData.isActive 
                            ? 'bg-green-600' 
                            : 'bg-gray-200 dark:bg-gray-600'
                          }
                        `}
                        aria-label="Toggle active status"
                        aria-pressed={formData.isActive}
                      >
                        <span
                          className={`
                            inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-300 ease-out
                            ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                  </div>
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
          </form>
        </div>

        {/* Footer - Sticky on mobile */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-10 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
              Creating new subject
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
                aria-label="Cancel creation"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Cancel
              </Button>
              <button 
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`
                  rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium
                  flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center
                  ${isSubmitting
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
                  }
                  transition-all duration-150 focus:ring-blue-500
                `}
                aria-label="Create subject"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Create Subject
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