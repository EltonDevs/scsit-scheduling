
"use client";

import React, { useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import ErrorModalAlerts from "@/components/example/ModalExample/ErrorModal";
import { createDepartment, Department } from "@/services/departmentService";
import Spinner from "@/components/loading/Spinner";



interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDepartment: Department) => void;
}

export default function AddDepartmentModal({ isOpen, onClose, onSave }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [errors, setErrors] = useState({ code: "", name: "", description: "" });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (
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

  const handleSave = async () => {
    const newErrors = { code: "", name: "" , description: ""};

    if (!formData.code) newErrors.code = "Department code is required";
    if (!formData.name) newErrors.name = "Department name is required";
    if (!formData.description) newErrors.description = "Department description is required";

    setErrors(newErrors);

    if (newErrors.code || newErrors.name) {
      return;
    }

    setIsLoading(true);
    try {
      const newDepartment = await createDepartment({
        code: formData.code,
        name: formData.name,
        description: formData.description,
        status: formData.status
      });

      setFormData({ code: "", name: "", description:"" , status: "ACTIVE" });
      setErrorModal({ isOpen: false, message: "" });
      onSave(newDepartment);
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error connecting to the server.";
      setErrorModal({
        isOpen: true,
        message: errorMessage,
      });
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
      className="max-w-[584px] p-5 lg:p-10"
      aria-modal="true"
      aria-labelledby="add-department-modal-title"
    >
      <ErrorModalAlerts
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={handleErrorModalClose}

      />
      <form onSubmit={(e) => e.preventDefault()}>
        <h4
          id="add-department-modal-title"
          className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90"
        >
          Add Department
        </h4>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label htmlFor="code">Department Code</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="CS"
              value={formData.code}
              onChange={handleFormChange}
              aria-describedby="code-error"
              disabled={isLoading}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-500" id="code-error">
                {errors.code}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Computer Science"
              value={formData.name}
              onChange={handleFormChange}
              aria-describedby="name-error"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500" id="name-error">
                {errors.name}
              </p>
            )}
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              placeholder="Optional description of the department"
              value={formData.description}
              onChange={handleFormChange}
              aria-describedby="description-error"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500" id="description-error">
                {errors.description}
              </p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={toggleStatus}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  formData.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    formData.status === "ACTIVE" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formData.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className="relative"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" color="text-white" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}




