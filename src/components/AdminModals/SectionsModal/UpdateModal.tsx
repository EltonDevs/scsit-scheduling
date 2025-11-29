"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
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
  Save,
  RotateCcw,
  Building2,
} from "lucide-react";

interface Course {
  courseId: string;
  title: string;
  departmentId: string; // Added to map course to department
}

interface Semester {
  semesterId: string;
  name: string;
}

interface Department {
  departmentId: string;
  name: string;
}

interface UpdateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section | null;
  onSubmit: (sectionId: string, data: Partial<Section>) => Promise<void>;
  isLoading?: boolean;
  courses?: Array<Course>;
  semesters?: Array<Semester>;
  departments?: Array<Department>;
}

export default function UpdateSectionModal({
  isOpen,
  onClose,
  section,
  onSubmit,
  isLoading = false,
  courses = [],
  semesters = [],
  departments = [],
}: UpdateSectionModalProps) {
  const [formData, setFormData] = useState<Partial<Section>>({
    code: "",
    name: "",
    yearLevel: 1,
    maxStudents: 30,
    status: "ACTIVE",
    courseId: "",
    semesterId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derive department name based on selected course
  const selectedCourse = courses.find((course) => course.courseId === formData.courseId);
  const selectedDepartment = selectedCourse
    ? departments.find((dept) => dept.departmentId === selectedCourse.departmentId)
    : null;

  // Initialize form when section changes
  useEffect(() => {
    if (section) {
      setFormData({
        code: section.code || "",
        name: section.name || "",
        yearLevel: section.yearLevel || 1,
        maxStudents: section.maxStudents || 30,
        status: section.status || "ACTIVE",
        courseId: section.courseId || "",
        semesterId: section.semesterId || "",
      });
      setErrors({});
    }
  }, [section]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "yearLevel" ? parseInt(value) : value,
    }));

    // Clear error when user selects an option
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code?.trim()) {
      newErrors.code = "Section code is required";
    } else if (formData.code.trim().length < 2) {
      newErrors.code = "Section code must be at least 2 characters";
    }

    if (!formData.name?.trim()) {
      newErrors.name = "Section name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Section name must be at least 2 characters";
    }

    if (!formData.yearLevel || formData.yearLevel < 1 || formData.yearLevel > 5) {
      newErrors.yearLevel = "Year level must be between 1 and 5";
    }

    if (!formData.maxStudents || formData.maxStudents < 1) {
      newErrors.maxStudents = "Maximum students must be at least 1";
    } else if (formData.maxStudents > 100) {
      newErrors.maxStudents = "Maximum students cannot exceed 100";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Course is required";
    }

    if (!formData.semesterId) {
      newErrors.semesterId = "Semester is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !section || !selectedCourse) return;

    try {
      // Include departmentId from the selected course
      const updatedData = {
        ...formData,
        departmentId: selectedCourse.departmentId,
      };
      await onSubmit(section.sectionId, updatedData);
      onClose();
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  };

  const handleReset = () => {
    if (section) {
      setFormData({
        code: section.code || "",
        name: section.name || "",
        yearLevel: section.yearLevel || 1,
        maxStudents: section.maxStudents || 30,
        status: section.status || "ACTIVE",
        courseId: section.courseId || "",
        semesterId: section.semesterId || "",
      });
      setErrors({});
    }
  };

  if (!section) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="update-section-modal-title"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2
                    id="update-section-modal-title"
                    className="text-xl font-bold truncate"
                  >
                    Update Section
                  </h2>
                  <p className="text-sm text-blue-100 mt-1 truncate">
                    {section.code} - {section.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
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
                      {/* Status */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="status"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3 flex-shrink-0" />
                          Status
                        </Label>
                        <Select
                          defaultValue={formData.status}
                          onChange={(value) => handleSelectChange("status", value)}
                          options={[
                            { value: "ACTIVE", label: "Active" },
                            { value: "INACTIVE", label: "Inactive" },
                            { value: "FULL", label: "Full" },
                          ]}
                          placeholder="Select status"
                        />
                        {errors.status && (
                          <p className="text-xs text-red-500 mt-1">{errors.status}</p>
                        )}
                      </div>

                      {/* Section Code */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="code"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Hash className="w-3 h-3 flex-shrink-0" />
                          Section Code *
                        </Label>
                        <Input
                          type="text"
                          id="code"
                          name="code"
                          value={formData.code}
                          onChange={handleInputChange}
                          error={!!errors.code}
                          placeholder="e.g., CS-101-A"
                        />
                        {errors.code && (
                          <p className="text-xs text-red-500 mt-1">{errors.code}</p>
                        )}
                      </div>

                      {/* Section Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Text className="w-3 h-3 flex-shrink-0" />
                          Section Name *
                        </Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          error={!!errors.name}
                          placeholder="e.g., Computer Science Section A"
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Year Level */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="yearLevel"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <GraduationCap className="w-3 h-3 flex-shrink-0" />
                          Year Level *
                        </Label>
                        <Select
                          defaultValue={formData.yearLevel?.toString()}
                          onChange={(value) => handleSelectChange("yearLevel", value)}
                          options={[
                            { value: "1", label: "1st Year" },
                            { value: "2", label: "2nd Year" },
                            { value: "3", label: "3rd Year" },
                            { value: "4", label: "4th Year" },
                            { value: "5", label: "5th Year" },
                          ]}
                          placeholder="Select year level"
                        />
                        {errors.yearLevel && (
                          <p className="text-xs text-red-500 mt-1">{errors.yearLevel}</p>
                        )}
                      </div>

                      {/* Max Students */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="maxStudents"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3 flex-shrink-0" />
                          Maximum Students *
                        </Label>
                        <Input
                          type="number"
                          id="maxStudents"
                          name="maxStudents"
                          value={formData.maxStudents}
                          onChange={handleInputChange}
                          error={!!errors.maxStudents}
                          placeholder="e.g., 30"
                          min="1"
                          max="100"
                        />
                        {errors.maxStudents && (
                          <p className="text-xs text-red-500 mt-1">{errors.maxStudents}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Course Information */}
                <div className="space-y-4 sm:space-y-6">
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
                          htmlFor="courseId"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          Course *
                        </Label>
                        <Select
                          defaultValue={formData.courseId}
                          onChange={(value) => handleSelectChange("courseId", value)}
                          options={courses.map((course) => ({
                            value: course.courseId,
                            label: course.title,
                          }))}
                          placeholder="Select a course"
                        />
                        {errors.courseId && (
                          <p className="text-xs text-red-500 mt-1">{errors.courseId}</p>
                        )}
                      </div>

                      {/* Semester */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="semesterId"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          Semester *
                        </Label>
                        <Select
                          defaultValue={formData.semesterId}
                          onChange={(value) => handleSelectChange("semesterId", value)}
                          options={semesters.map((semester) => ({
                            value: semester.semesterId,
                            label: semester.name,
                          }))}
                          placeholder="Select a semester"
                        />
                        {errors.semesterId && (
                          <p className="text-xs text-red-500 mt-1">{errors.semesterId}</p>
                        )}
                      </div>

                      {/* Department (Read-only) */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="department"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          Department
                        </Label>
                        <div className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-100 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600">
                          {selectedDepartment ? selectedDepartment.name : "Select a course to view department"}
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
                          {new Date(section.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Updated At */}
                      <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Last Updated
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {section.updatedAt
                            ? new Date(section.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
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

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-10 shrink-0">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 w-full sm:w-auto text-center sm:text-left">
                Editing: {section.code} • {section.courseTitle}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
                  aria-label="Reset changes"
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Reset
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-1 sm:flex-initial justify-center"
                  aria-label="Cancel update"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-initial justify-center"
                  aria-label="Save changes"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}