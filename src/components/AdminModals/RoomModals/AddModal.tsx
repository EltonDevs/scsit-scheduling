"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/loading/Spinner";
import ErrorModalAlerts from "@/components/example/ModalExample/ErrorModal";
import { AlertCircle } from "lucide-react";
import { Room } from "@/services/roomService";

interface Department {
  departmentId: string;
  name: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (room: Omit<Room, "roomId" | "createdAt" | "updatedAt" | "departmentName">) => void;
  departments: Department[];
  isLoading?: boolean;
}

export default function AddRoomModal({
  isOpen,
  onClose,
  onAdd,
  departments,
  isLoading = false,
}: AddRoomModalProps) {
  const [formData, setFormData] = useState({
    roomCode: "",
    name: "",
    capacity: 30,
    building: "",
    floor: "",
    type: "LECTURE" as "LECTURE" | "LAB" | "SEMINAR" | "AUDITORIUM",
    departmentId: "",
    status: "AVAILABLE" as "AVAILABLE" | "OCCUPIED" | "MAINTENANCE",
    isPublic: false,
    equipment: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTogglePublic = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
    setErrors((prev) => ({ ...prev, isPublic: "" }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    let isValid = true;

    if (!formData.roomCode.trim()) {
      newErrors.roomCode = "Room code is required";
      isValid = false;
    } else if (formData.roomCode.trim().length < 2) {
      newErrors.roomCode = "Room code must be at least 2 characters";
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Room name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
      isValid = false;
    } else if (formData.capacity > 500) {
      newErrors.capacity = "Capacity cannot exceed 500";
      isValid = false;
    }

    if (!formData.building.trim()) {
      newErrors.building = "Building is required";
      isValid = false;
    }

    if (!formData.floor.trim()) {
      newErrors.floor = "Floor is required";
      isValid = false;
    }

    if (!formData.type) {
      newErrors.type = "Room type is required";
      isValid = false;
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Department is required";
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (onAdd) {
        onAdd(formData);
      }
      setFormData({
        roomCode: "",
        name: "",
        capacity: 30,
        building: "",
        floor: "",
        type: "LECTURE",
        departmentId: "",
        status: "AVAILABLE",
        isPublic: false,
        equipment: "",
      });
      setErrors({});
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save room";
      setErrorModal({ isOpen: true, message: errorMessage });
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
      aria-labelledby="add-room-modal-title"
    >
      <ErrorModalAlerts
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={handleErrorModalClose}
      />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="rounded-t-lg -mx-6 -mt-8 px-6 py-4">
          <h4
            id="add-room-modal-title"
            className="text-lg font-semibold text-white"
          >
            Add New Room
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-1">
            <Label htmlFor="roomCode" className="text-gray-700 dark:text-gray-200 font-medium">
              Room Code
            </Label>
            <Input
              id="roomCode"
              name="roomCode"
              type="text"
              placeholder="e.g., RM101"
              value={formData.roomCode}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="roomCode-error"
              disabled={isLoading}
            />
            {errors.roomCode && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="roomCode-error">
                <AlertCircle size={16} />
                {errors.roomCode}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">
              Room Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Lecture Hall A"
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
            <Label htmlFor="capacity" className="text-gray-700 dark:text-gray-200 font-medium">
              Capacity
            </Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              placeholder="e.g., 30"
              value={formData.capacity}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              aria-describedby="capacity-error"
              disabled={isLoading}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="capacity-error">
                <AlertCircle size={16} />
                {errors.capacity}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="building" className="text-gray-700 dark:text-gray-200 font-medium">
              Building
            </Label>
            <Input
              id="building"
              name="building"
              type="text"
              placeholder="e.g., Main Hall"
              value={formData.building}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="floor" className="text-gray-700 dark:text-gray-200 font-medium">
              Floor
            </Label>
            <Input
              id="floor"
              name="floor"
              type="text"
              placeholder="e.g., 2nd Floor"
              value={formData.floor}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="type" className="text-gray-700 dark:text-gray-200 font-medium">
              Room Type
            </Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading}
              aria-describedby="type-error"
            >
              <option value="">Select Type</option>
              {["LECTURE", "LAB", "SEMINAR", "AUDITORIUM"].map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="type-error">
                <AlertCircle size={16} />
                {errors.type}
              </p>
            )}
          </div>

          <div className="col-span-1">
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
            <Label htmlFor="status" className="text-gray-700 dark:text-gray-200 font-medium">
              Status
            </Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
              disabled={isLoading}
              aria-describedby="status-error"
            >
              <option value="">Select Status</option>
              {["AVAILABLE", "OCCUPIED", "MAINTENANCE"].map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1" id="status-error">
                <AlertCircle size={16} />
                {errors.status}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label htmlFor="isPublic" className="text-gray-700 dark:text-gray-200 font-medium">
              Public Access
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-200 ease-in-out ${
                  formData.isPublic
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 hover:bg-gray-500"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
                role="switch"
                aria-checked={formData.isPublic}
                aria-label={`Toggle public access to ${formData.isPublic ? "Private" : "Public"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                    formData.isPublic ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {formData.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>

          <div className="col-span-2">
            <Label htmlFor="equipment" className="text-gray-700 dark:text-gray-200 font-medium">
              Equipment
            </Label>
            <textarea
              id="equipment"
              name="equipment"
              placeholder="e.g., Projector, Whiteboard, Lab Equipment"
              value={formData.equipment}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm min-h-[100px]"
              disabled={isLoading}
            />
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
              "Save Room"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}