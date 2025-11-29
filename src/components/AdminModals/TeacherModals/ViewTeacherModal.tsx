"use client";

import React from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Image from "next/image";
import Badge from "../../ui/badge/Badge";
import { Teacher } from "@/data/teachers";

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
}

export default function TeacherModal({ isOpen, onClose, teacher }: TeacherModalProps) {
  if (!teacher) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 lg:p-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Teacher Profile
          </h3>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            {teacher.profile_picture ? (
              <Image
                src={teacher.profile_picture}
                alt={teacher.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                No Image
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {teacher.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {teacher.department || "No department"}
            </p>
            <Badge size="sm" color={teacher.is_active ? "success" : "error"}>
              {teacher.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <Detail label="Email" value={teacher.email} />
          <Detail label="Phone Number" value={teacher.phone_number || "Not provided"} />
          <Detail label="Department" value={teacher.department || "N/A"} />
          <Detail label="Role" value={teacher.role || "N/A"} />
          <Detail label="Assigned Since" value={teacher.assigned_since || "Not provided"} />
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Reusable detail display
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
    </div>
  );
}
