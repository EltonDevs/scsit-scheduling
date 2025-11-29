
"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/loading/Spinner";
import ErrorModalAlerts from "@/components/example/ModalExample/ErrorModal";
import { Department } from "@/services/departmentService";
import { AlertCircle } from "lucide-react";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newCourse: {
    courseCode: string;
    title: string;
    departmentId: string;
    departmentName: string;
    description?: string | null;
    durationYears?: number | null;
    status: "ACTIVE" | "INACTIVE";
  }) => Promise<void>;
  departments: Department[];
}

export default function AddCourseModal({
  isOpen,
  onClose,
  onAdd,
  departments,
}: AddCourseModalProps) {
  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    departmentId: "",
    departmentName: "",
    durationYears: 4,
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let isValid = true;

    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
      isValid = false;
    }
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }
    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
      isValid = false;
    }
    if (!formData.durationYears || formData.durationYears <= 0) {
      newErrors.durationYears = "Duration must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
    
      await onAdd({
        courseCode: formData.courseCode,
        title: formData.title,
        departmentId: formData.departmentId,
        durationYears: Number(formData.durationYears),
        description: formData.description || undefined,
        status: formData.status,
        departmentName: departments.find(dept => dept.departmentId === formData.departmentId)?.name || "",
      });
      setFormData({
        courseCode: "",
        title: "",
        departmentId: "",
        durationYears: 4,
        departmentName: "",
        description: "",
        status: "ACTIVE",
      });
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save course";
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
      aria-labelledby="add-course-modal-title"
    >
      <ErrorModalAlerts
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={handleErrorModalClose}
      />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="rounded-t-lg -mx-6 -mt-8 px-6 py-4">
          <h4
            id="add-course-modal-title"
            className="text-lg font-semibold text-white"
          >
            Add New Course
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-1">
            <Label htmlFor="courseCode" className="text-gray-700 dark:text-gray-200 font-medium">
              Course Code
            </Label>
            <Input
              id="courseCode"
              name="courseCode"
              type="text"
              placeholder="e.g., BSCS"
              value={formData.courseCode}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="courseCode-error"
              disabled={isLoading}
            />
            {errors.courseCode && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="courseCode-error">
                <AlertCircle size={16} />
                {errors.courseCode}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="title" className="text-gray-700 dark:text-gray-200 font-medium">
              Course Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Bachelor of Science in Computer Science"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="title-error"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="title-error">
                <AlertCircle size={16} />
                {errors.title}
              </p>
            )}
          </div>

          <div className="col-span-1 ">
            <Label htmlFor="departmentId" className="text-gray-700 dark:text-gray-200 font-medium">
              Department
            </Label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading || departments.length === 0}
              aria-describedby="departmentId-error"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="departmentId-error">
                <AlertCircle size={16} />
                {errors.departmentId}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="durationYears" className="text-gray-700 dark:text-gray-200 font-medium">
              Duration (Years)
            </Label>
            <Input
              id="durationYears"
              name="durationYears"
              type="number"
              min="1"
              placeholder="e.g., 4"
              value={formData.durationYears}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="durationYears-error"
              disabled={isLoading}
            />
            {errors.durationYears && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="durationYears-error">
                <AlertCircle size={16} />
                {errors.durationYears}
              </p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2 relative group">
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-200 font-medium">
              Description
              <span className="ml-1 text-gray-400 text-xs">(Optional)</span>
            </Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Enter course description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading}
            />
            <div className="absolute hidden group-hover:block top-0 right-0 mt-8 mr-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              Provide a brief description of the course (optional).
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-200 font-medium">
              Status
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={toggleStatus}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-200 ease-in-out ${
                  formData.status === "ACTIVE"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 hover:bg-gray-500"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
                role="switch"
                aria-checked={formData.status === "ACTIVE"}
                aria-label={`Toggle status to ${formData.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                    formData.status === "ACTIVE"
                      ? "translate-x-6"
                      : "translate-x-1"
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
              "Save Course"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}