"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/loading/Spinner";
import ErrorModalAlerts from "@/components/example/ModalExample/ErrorModal";
import {
  X,
  Building2,
  Hash,
  Text,
  Users,
  MapPin,
  Layers,
  Globe,
  Cpu,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Save,
  Edit,
} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { Room } from "@/services/roomService";

interface Department {
  departmentId: string;
  name: string;
}

interface UpdateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onUpdate: (roomId: string, roomData: Partial<Room>) => void;
  departments: Department[];
  isLoading?: boolean;
}

export default function UpdateRoomModal({
  isOpen,
  onClose,
  room,
  onUpdate,
  departments,
  isLoading = false,
}: UpdateRoomModalProps) {
  const [formData, setFormData] = useState<Partial<Room>>({
    roomCode: "",
    name: "",
    capacity: 30,
    building: "",
    floor: "",
    departmentId: "",
    type: "LECTURE",
    status: "AVAILABLE",
    isPublic: false,
    equipment: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    if (room) {
      setFormData({
        roomCode: room.roomCode || "",
        name: room.name || "",
        capacity: room.capacity || 30,
        building: room.building || "",
        floor: room.floor || "",
        departmentId: room.departmentId || "",
        type: room.type || "LECTURE",
        status: room.status || "AVAILABLE",
        isPublic: room.isPublic || false,
        equipment: room.equipment || "",
      });
      setErrors({});
    }
  }, [room]);

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

    if (!formData.roomCode?.trim()) {
      newErrors.roomCode = "Room code is required";
      isValid = false;
    } else if (formData.roomCode.trim().length < 2) {
      newErrors.roomCode = "Room code must be at least 2 characters";
      isValid = false;
    }

    if (!formData.name?.trim()) {
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

    if (!formData.building?.trim()) {
      newErrors.building = "Building is required";
      isValid = false;
    }

    if (!formData.floor?.trim()) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !room) return;

    try {
      onUpdate(room.roomId, formData);
      setErrors({});
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update room";
      setErrorModal({ isOpen: true, message: errorMessage });
    }
  };

  const handleErrorModalClose = () => {
    setErrorModal({ isOpen: false, message: "" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "success";
      case "OCCUPIED":
        return "warning";
      case "MAINTENANCE":
        return "error";
      default:
        return "primary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "OCCUPIED":
        return "Occupied";
      case "MAINTENANCE":
        return "Under Maintenance";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <CheckCircle className="w-4 h-4" />;
      case "OCCUPIED":
        return <AlertCircle className="w-4 h-4" />;
      case "MAINTENANCE":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "LECTURE":
        return "primary";
      case "LAB":
        return "success";
      case "SEMINAR":
        return "warning";
      case "AUDITORIUM":
        return "info";
      default:
        return "light";
    }
  };

  const getRoomTypeText = (type: string) => {
    switch (type) {
      case "LECTURE":
        return "Lecture Room";
      case "LAB":
        return "Laboratory";
      case "SEMINAR":
        return "Seminar Room";
      case "AUDITORIUM":
        return "Auditorium";
      default:
        return type;
    }
  };

  const getPublicAccessBadge = (isPublic: boolean) => {
    return (
      <Badge size="sm" color={isPublic ? "success" : "primary"}>
        <Globe className="w-3 h-3" />
        {isPublic ? "Public Access" : "Restricted Access"}
      </Badge>
    );
  };

  if (!room) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="update-room-modal-title"
    >
      <ErrorModalAlerts
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={handleErrorModalClose}
      />

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
          {/* Header with gradient background - Sticky on mobile */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                  <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h2
                    id="update-room-modal-title"
                    className="text-xl font-bold truncate"
                  >
                    Update Room
                  </h2>
                  <p className="text-sm text-green-100 mt-1 truncate">
                    {room.roomCode} - {room.name}
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
                  {/* Room Information Card */}
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Room Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Status and Type Badges */}
                      <div className="flex flex-wrap gap-2">
                        <Badge size="sm" color={getStatusColor(room.status)}>
                          {getStatusIcon(room.status)}
                          {getStatusText(room.status)}
                        </Badge>
                        <Badge size="sm" color={getRoomTypeColor(room.type)}>
                          {getRoomTypeText(room.type)}
                        </Badge>
                        {getPublicAccessBadge(room.isPublic)}
                      </div>

                      {/* Room Code */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="roomCode"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Hash className="w-3 h-3 flex-shrink-0" />
                          Room Code *
                        </Label>
                        <Input
                          id="roomCode"
                          name="roomCode"
                          type="text"
                          value={formData.roomCode}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
                          aria-describedby="roomCode-error"
                          disabled={isLoading}
                        />
                        {errors.roomCode && (
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="roomCode-error"
                          >
                            <AlertCircle size={16} />
                            {errors.roomCode}
                          </p>
                        )}
                      </div>

                      {/* Room Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Text className="w-3 h-3 flex-shrink-0" />
                          Room Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
                          aria-describedby="name-error"
                          disabled={isLoading}
                        />
                        {errors.name && (
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="name-error"
                          >
                            <AlertCircle size={16} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Capacity */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="capacity"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Users className="w-3 h-3 flex-shrink-0" />
                          Capacity *
                        </Label>
                        <Input
                          id="capacity"
                          name="capacity"
                          type="number"
                          min="1"
                          max="500"
                          value={formData.capacity}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
                          aria-describedby="capacity-error"
                          disabled={isLoading}
                        />
                        {errors.capacity && (
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="capacity-error"
                          >
                            <AlertCircle size={16} />
                            {errors.capacity}
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
                          Department *
                        </Label>
                        <select
                          id="departmentId"
                          name="departmentId"
                          value={formData.departmentId}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
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
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="departmentId-error"
                          >
                            <AlertCircle size={16} />
                            {errors.departmentId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location Information Card */}
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Location Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Building */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="building"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          Building *
                        </Label>
                        <Input
                          id="building"
                          name="building"
                          type="text"
                          value={formData.building}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
                          aria-describedby="building-error"
                          disabled={isLoading}
                        />
                        {errors.building && (
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="building-error"
                          >
                            <AlertCircle size={16} />
                            {errors.building}
                          </p>
                        )}
                      </div>

                      {/* Floor */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="floor"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Layers className="w-3 h-3 flex-shrink-0" />
                          Floor *
                        </Label>
                        <Input
                          id="floor"
                          name="floor"
                          type="text"
                          value={formData.floor}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
                          aria-describedby="floor-error"
                          disabled={isLoading}
                        />
                        {errors.floor && (
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="floor-error"
                          >
                            <AlertCircle size={16} />
                            {errors.floor}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Equipment and Settings */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Settings Card */}
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Room Settings
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Room Type */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="type"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Cpu className="w-3 h-3 flex-shrink-0" />
                          Room Type *
                        </Label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
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
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="type-error"
                          >
                            <AlertCircle size={16} />
                            {errors.type}
                          </p>
                        )}
                      </div>

                      {/* Status */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="status"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Cpu className="w-3 h-3 flex-shrink-0" />
                          Status *
                        </Label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
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
                          <p
                            className="mt-1 text-sm text-red-500 flex items-center gap-1"
                            id="status-error"
                          >
                            <AlertCircle size={16} />
                            {errors.status}
                          </p>
                        )}
                      </div>

                      {/* Public Access */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="isPublic"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3 flex-shrink-0" />
                          Access Type
                        </Label>
                        <div className="flex items-center gap-3">
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
                            aria-label={`Toggle public access to ${
                              formData.isPublic ? "Private" : "Public"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                                formData.isPublic ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {formData.isPublic ? "Public" : "Private"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Information Card */}
                  <div className="bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                        Equipment & Facilities
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Equipment List */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="equipment"
                          className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          <Cpu className="w-3 h-3 flex-shrink-0" />
                          Equipment Description
                        </Label>
                        <textarea
                          id="equipment"
                          name="equipment"
                          value={formData.equipment}
                          onChange={handleChange}
                          placeholder="List available equipment and facilities..."
                          rows={4}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow hover:shadow-sm"
                          disabled={isLoading}
                        />
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
                          {formatDate(room.createdAt)}
                        </p>
                      </div>

                      {/* Updated At */}
                      <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Last Updated
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(room.updatedAt)}
                        </p>
                      </div>

                      {/* Room ID */}
                      <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Room ID
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {room.roomId}
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
                {room.building} • {room.departmentName}
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
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
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" color="text-white" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}