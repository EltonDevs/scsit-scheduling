"use client";

import React, { useState } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Spinner from "@/components/loading/Spinner";
import ErrorModalAlerts from "@/components/example/ModalExample/ErrorModal";
import { AlertCircle } from "lucide-react";
import { Room } from "@/services/roomService";

interface DeleteRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onDelete?: (roomId: string) => void;
  isLoading?: boolean;
}

export default function DeleteRoomModal({
  isOpen,
  onClose,
  room,
  onDelete,
  isLoading = false,
}: DeleteRoomModalProps) {
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

  if (!room) return null;

  const handleDelete = async () => {
    try {
      if (room && onDelete) {
        onDelete(room.roomId);
      }
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete room";
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
      className="w-full max-w-[500px] p-6 sm:p-8 rounded-xl bg-white dark:bg-gray-900 shadow-lg"
      aria-labelledby="delete-room-modal-title"
      aria-describedby="delete-room-modal-description"
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
          id="delete-room-modal-title"
          className="mb-3 text-xl font-bold text-gray-800 dark:text-white/90"
        >
          Confirm Deletion
        </h4>

        <p
          id="delete-room-modal-description"
          className="text-base text-gray-600 dark:text-gray-400 mb-6"
        >
          Are you sure you want to delete{" "}
          <span className="font-semibold text-brand-500 dark:text-brand-400">
            {room.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform duration-200 active:scale-95"
            aria-label={`Cancel deletion of ${room.name}`}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto bg-error-600 hover:bg-error-700 text-white transition-transform duration-200 active:scale-95"
            aria-label={`Confirm deletion of ${room.name}`}
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