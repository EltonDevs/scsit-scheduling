 "use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Room } from "@/services/roomService"; // Adjust import path as needed
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
  AlertTriangle
} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface ViewRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export default function ViewRoomModal({ 
  isOpen, 
  onClose, 
  room,
  isLoading = false
}: ViewRoomModalProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'success';
      case 'OCCUPIED':
        return 'warning';
      case 'MAINTENANCE':
        return 'error';
      default:
        return 'primary';
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'OCCUPIED':
        return 'Occupied';
      case 'MAINTENANCE':
        return 'Under Maintenance';
      default:
        return status;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <CheckCircle className="w-4 h-4" />;
      case 'OCCUPIED':
        return <AlertCircle className="w-4 h-4" />;
      case 'MAINTENANCE':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Get room type color
  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return 'primary';
      case 'LAB':
        return 'success';
      case 'SEMINAR':
        return 'warning';
      case 'AUDITORIUM':
        return 'info';
      default:
        return 'light';
    }
  };

  // Get room type display text
  const getRoomTypeText = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return 'Lecture Room';
      case 'LAB':
        return 'Laboratory';
      case 'SEMINAR':
        return 'Seminar Room';
      case 'AUDITORIUM':
        return 'Auditorium';
      default:
        return type;
    }
  };

  // Get public access badge
  const getPublicAccessBadge = (isPublic: boolean) => {
    return (
      <Badge
        size="sm"
        color={isPublic ? 'success' : 'primary'}
     
      >
        <Globe className="w-3 h-3" />
        {isPublic ? 'Public Access' : 'Restricted Access'}
      </Badge>
    );
  };

  if (!room) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-4xl mx-4 rounded-2xl p-0 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800"
      aria-labelledby="view-room-modal-title"
    >
      <div className="flex flex-col h-full max-h-[90vh] md:max-h-[85vh]">
        {/* Header with gradient background - Sticky on mobile */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 p-4 sm:p-6 text-white sticky top-0 z-10 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h2
                  id="view-room-modal-title"
                  className="text-xl font-bold truncate"
                >
                  View Room
                </h2>
                <p className="text-sm text-blue-100 mt-1 truncate">
                  {room.roomCode} - {room.name}
                </p>
              </div>
            </div>
            <button
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
                      <Badge
                        size="sm"
                        color={getStatusColor(room.status)}
                        
                      >
                        {getStatusIcon(room.status)}
                        {getStatusText(room.status)}
                      </Badge>
                      <Badge
                        size="sm"
                        color={getRoomTypeColor(room.type)}
                      >
                        {getRoomTypeText(room.type)}
                      </Badge>
                      {getPublicAccessBadge(room.isPublic)}
                    </div>

                    {/* Room Code */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Hash className="w-3 h-3 flex-shrink-0" />
                        Room Code
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {room.roomCode}
                      </div>
                    </div>

                    {/* Room Name */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Text className="w-3 h-3 flex-shrink-0" />
                        Room Name
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {room.name}
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1"
                      >
                        <Users className="w-3 h-3 flex-shrink-0" />
                        Capacity
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {room.capacity} people
                      </div>
                    </div>

                    {/* Department */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        Department
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {room.departmentName}
                      </div>
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
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Building2 className="w-3 h-3 flex-shrink-0" />
                        Building
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {room.building}
                      </div>
                    </div>

                    {/* Floor */}
                    <div className="space-y-2">
                      <Label 
                        className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3 flex-shrink-0" />
                        Floor
                      </Label>
                      <div className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-white/5 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {room.floor}{room.floor === '1' ? 'st' : room.floor === '2' ? 'nd' : room.floor === '3' ? 'rd' : 'th'} Floor
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Equipment and Metadata */}
              <div className="space-y-4 sm:space-y-6">
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
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Available Equipment
                      </p>
                      <div className="space-y-2">
                        {room.equipment ? (
                          <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {room.equipment}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No equipment listed
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Room Type Details */}
                    <div className="p-3 border rounded-lg bg-white dark:bg-white/5 border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Room Type Details
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Primary Use:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">{getRoomTypeText(room.type)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Access Type:</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {room.isPublic ? 'Public' : 'Restricted'}
                          </span>
                        </div>
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
                aria-label="Close modal"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}