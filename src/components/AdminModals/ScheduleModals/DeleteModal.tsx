"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { AlertCircle } from "lucide-react";
import ErrorModalAlerts from "@/components/example/ModalExample/ErrorModal";
import { Schedule } from "@/types/Schedule";
import Spinner from "@/components/loading/Spinner";

interface DeleteScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  onDelete: (scheduleId: string) => void;
}

export default function DeleteScheduleModal({
  isOpen,
  onClose,
  schedule,
  onDelete,
}: DeleteScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  const handleDelete = async () => {
    if (!schedule?.scheduleId) {
      setErrorModal({
        isOpen: true,
        message: "Schedule ID is missing.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(schedule.scheduleId);
      setErrorModal({ isOpen: false, message: "" });
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

  if (!schedule) return null;

  // Format schedule details for display
  const scheduleDetails = `${schedule.subjectName || schedule.subjectId} - ${
    schedule.dayOfWeek
  } (${schedule.startTime.slice(0, 5)} - ${schedule.endTime.slice(0, 5)})`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-[500px] p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-900 shadow-lg"
      aria-labelledby="delete-schedule-modal-title"
      aria-describedby="delete-schedule-modal-description"
    >
      <ErrorModalAlerts
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={handleErrorModalClose}
      />
      <div className="text-center animate-fade-in">
        <div className="relative flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-brand-500/20 to-error-500/20 flex items-center justify-center animate-pulse">
            <AlertCircle size={32} className="text-error-600 dark:text-error-500" />
          </div>
        </div>

        <h4
          id="delete-schedule-modal-title"
          className="mb-3 text-xl font-bold text-gray-800 dark:text-white/90"
        >
          Confirm Deletion
        </h4>

        <p
          id="delete-schedule-modal-description"
          className="text-base text-gray-600 dark:text-gray-400 mb-6"
        >
          Are you sure you want to delete the schedule{" "}
          <span className="font-semibold text-brand-500 dark:text-brand-400">
            {scheduleDetails}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform duration-200 active:scale-95"
            aria-label={`Cancel deletion of ${scheduleDetails}`}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            className="w-full sm:w-auto bg-error-600 hover:bg-error-700 text-white transition-transform duration-200 active:scale-95"
            aria-label={`Confirm deletion of ${scheduleDetails}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" color="text-white" />
                Deleting...
              </span>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}