"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/loading/Spinner";
import ErrorModalAlerts from "@/components/example/ModalExample/ErrorModal";
import { AlertCircle } from "lucide-react";

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

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (section: Omit<Section, "sectionId" | "createdAt" | "updatedAt" | "courseTitle" | "semesterName">) => void;
  courses: Course[];
  semesters: Semester[];
  departments: Department[];
}

interface Section {
  sectionId: string;
  code: string;
  name: string;
  yearLevel: number;
  maxStudents: number;
  status: "ACTIVE" | "INACTIVE" | "FULL";
  courseId: string;
  semesterId: string;
  departmentId: string;
  courseTitle?: string;
  semesterName?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AddSectionModal({
  isOpen,
  onClose,
  onAdd,
  courses,
  semesters,
  departments,
}: AddSectionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    yearLevel: 1,
    semesterId: "",
    courseId: "",
    maxStudents: 30,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  // Derive department name based on selected course
  const selectedCourse = courses.find((course) => course.courseId === formData.courseId);
  const selectedDepartment = selectedCourse
    ? departments.find((dept) => dept.departmentId === selectedCourse.departmentId)
    : null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearLevel" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Section name is required";
      isValid = false;
    }
    if (!formData.code.trim()) {
      newErrors.code = "Section code is required";
      isValid = false;
    }
    if (!formData.semesterId) {
      newErrors.semesterId = "Semester is required";
      isValid = false;
    }
    if (!formData.courseId) {
      newErrors.courseId = "Course is required";
      isValid = false;
    }
    if (!formData.yearLevel || formData.yearLevel < 1 || formData.yearLevel > 5) {
      newErrors.yearLevel = "Year level must be between 1 and 5";
      isValid = false;
    }
    if (!formData.maxStudents || formData.maxStudents <= 0) {
      newErrors.maxStudents = "Max students must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm() || !selectedCourse) return;

    try {
      setIsLoading(true);
      if (onAdd) {
        // Include departmentId from the selected course
        const sectionData = {
          ...formData,
          departmentId: selectedCourse.departmentId,
        };
        onAdd(sectionData);
      }
      // Reset form
      setFormData({
        name: "",
        code: "",
        yearLevel: 1,
        semesterId: "",
        courseId: "",
        maxStudents: 30,
        status: "ACTIVE",
      });
      setErrors({});
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save section";
      setErrorModal({ isOpen: true, message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleErrorModalClose = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[90vw] sm:max-w-[584px] rounded-xl bg-white dark:bg-gray-800 shadow-xl px-6 py-8 lg:px-10 lg:py-10 transition-all duration-300"
      aria-modal="true"
      aria-labelledby="add-section-modal-title"
    >
      <ErrorModalAlerts
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={handleErrorModalClose}
      />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="rounded-t-lg -mx-6 -mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
          <h4
            id="add-section-modal-title"
            className="text-lg font-semibold text-white"
          >
            Add New Section
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-1">
            <Label htmlFor="code" className="text-gray-700 dark:text-gray-200 font-medium">
              Section Code
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="e.g., SEC101"
              value={formData.code}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="code-error"
              disabled={isLoading}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="code-error">
                <AlertCircle size={16} />
                {errors.code}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">
              Section Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Section A"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="name-error"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="name-error">
                <AlertCircle size={16} />
                {errors.name}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="semesterId" className="text-gray-700 dark:text-gray-200 font-medium">
              Semester
            </Label>
            <select
              id="semesterId"
              name="semesterId"
              value={formData.semesterId}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading || semesters.length === 0}
              aria-describedby="semesterId-error"
            >
              <option value="">Select Semester</option>
              {semesters.map((semester) => (
                <option key={semester.semesterId} value={semester.semesterId}>
                  {semester.name}
                </option>
              ))}
            </select>
            {errors.semesterId && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="semesterId-error">
                <AlertCircle size={16} />
                {errors.semesterId}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="courseId" className="text-gray-700 dark:text-gray-200 font-medium">
              Course
            </Label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading || courses.length === 0}
              aria-describedby="courseId-error"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
            {errors.courseId && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="courseId-error">
                <AlertCircle size={16} />
                {errors.courseId}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="department" className="text-gray-700 dark:text-gray-200 font-medium">
              Department
            </Label>
            <div className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-100 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600">
              {selectedDepartment ? selectedDepartment.name : "Select a course to view department"}
            </div>
          </div>

          <div className="col-span-1">
            <Label
              htmlFor="yearLevel"
              className="text-gray-700 dark:text-gray-200 font-medium flex items-center gap-1"
            >
              Year Level
            </Label>
            <select
              id="yearLevel"
              name="yearLevel"
              value={formData.yearLevel}
              onChange={handleChange}
              className={`
                mt-1 w-full px-3 py-2 rounded-md border text-sm appearance-none
                bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600
                transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                ${errors.yearLevel
                  ? "border-red-300 focus:border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 hover:border-gray-300"
                }
              `}
              disabled={isLoading}
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
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="yearLevel-error">
                <AlertCircle size={16} />
                {errors.yearLevel}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="maxStudents" className="text-gray-700 dark:text-gray-200 font-medium">
              Max Students
            </Label>
            <Input
              id="maxStudents"
              name="maxStudents"
              type="number"
              min="1"
              placeholder="e.g., 30"
              value={formData.maxStudents}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="maxStudents-error"
              disabled={isLoading}
            />
            {errors.maxStudents && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="maxStudents-error">
                <AlertCircle size={16} />
                {errors.maxStudents}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-200 font-medium">
              Status
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-200 ease-in-out ${
                  formData.status === "ACTIVE"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 hover:bg-gray-500"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
                role="switch"
                aria-checked={formData.status === "ACTIVE"}
                aria-label={`Toggle status to ${formData.status === "ACTIVE" ? "Inactive" : "Active"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                    formData.status === "ACTIVE" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {formData.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" color="text-white" />
                Saving...
              </span>
            ) : (
              "Save Section"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}