"use client";

import React from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { AlertCircle } from "lucide-react";
import { Teacher } from "@/services/teacherService";

interface DeleteTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onDelete?: (teacher: Teacher) => void;
}

export default function DeleteTeacherModal({
  isOpen,
  onClose,
  teacher,
  onDelete,
}: DeleteTeacherModalProps) {
  if (!teacher) return null;

  const handleDelete = () => {
    if (teacher && onDelete) {
     
      onDelete(teacher);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[500px] p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-900 shadow-lg"
      aria-labelledby="delete-teacher-modal-title"
      aria-describedby="delete-teacher-modal-description"
    >
      <div className="text-center animate-fade-in">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-500/20 to-error-500/20 flex items-center justify-center animate-pulse">
            <AlertCircle size={32} className="text-error-600 dark:text-error-500" />
          </div>
        </div>

        <h4
          id="delete-teacher-modal-title"
          className="mb-3 text-xl font-bold text-gray-800 dark:text-white/90"
        >
          Confirm Deletion
        </h4>

        <p
          id="delete-teacher-modal-description"
          className="text-base text-gray-600 dark:text-gray-400 mb-6"
        >
          Are you sure you want to delete {""}
          <span className="font-semibold text-brand-500 dark:text-brand-400">
            {teacher.firstName}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform duration-200 active:scale-95"
            aria-label={`Cancel deletion of ${teacher.firstName}`}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            className="w-full sm:w-auto bg-error-600 hover:bg-error-700 text-white transition-transform duration-200 active:scale-95"
            aria-label={`Confirm deletion of ${teacher.firstName}`}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}