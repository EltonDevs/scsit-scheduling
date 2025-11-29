/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Users, GraduationCap } from "lucide-react";
import type { Schedule } from "@/types/Schedule";
import Badge from "@/components/ui/badge/Badge";
import Spinner from "@/components/loading/Spinner";

interface ScheduleCalendarViewProps {
  schedules: Schedule[];
  isLoading?: boolean;
  onScheduleClick?: (schedule: Schedule) => void;
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

export default function ScheduleCalendarView({
  schedules,
  isLoading = false,
  onScheduleClick,
}: ScheduleCalendarViewProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Group schedules by day
  const schedulesByDay = useMemo(() => {
    const grouped: Record<string, Schedule[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
    };

    schedules.forEach((schedule) => {
      if (grouped[schedule.dayOfWeek]) {
        grouped[schedule.dayOfWeek].push(schedule);
      }
    });

    // Sort by start time
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    return grouped;
  }, [schedules]);

  // Calculate schedule position and height
  const getScheduleStyle = (schedule: Schedule) => {
    const startHour = parseInt(schedule.startTime.split(":")[0]);
    const startMinute = parseInt(schedule.startTime.split(":")[1]);
    const endHour = parseInt(schedule.endTime.split(":")[0]);
    const endMinute = parseInt(schedule.endTime.split(":")[1]);

    const startOffset = (startHour - 7) * 60 + startMinute; // Minutes from 7 AM
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

    return {
      top: `${(startOffset / 60) * 4}rem`, // 4rem per hour
      height: `${(duration / 60) * 4}rem`,
    };
  };

  // Get color for schedule card
  const getScheduleColor = (index: number) => {
    const colors = [
      "bg-blue-500 border-blue-600",
      "bg-purple-500 border-purple-600",
      "bg-green-500 border-green-600",
      "bg-orange-500 border-orange-600",
      "bg-pink-500 border-pink-600",
      "bg-teal-500 border-teal-600",
      "bg-indigo-500 border-indigo-600",
      "bg-red-500 border-red-600",
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="xl" color="text-brand-500" />
          <span className="text-gray-600 dark:text-gray-400">Loading calendar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-700 dark:to-brand-900 p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Weekly Schedule</h2>
              <p className="text-sm text-brand-100 mt-1">View all class schedules</p>
            </div>
          </div>
          <Badge size="sm" variant="solid" >
            {schedules.length} Classes
          </Badge>
        </div>
      </div>

      {/* Desktop Calendar View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-800">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Time</span>
            </div>
            {DAYS.map((day) => (
              <div
                key={day}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 border-r last:border-r-0 border-gray-200 dark:border-gray-800"
              >
                <div className="text-center">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{day}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {schedulesByDay[day].length} classes
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative">
            <div className="grid grid-cols-7">
              {/* Time Labels */}
              <div className="border-r border-gray-200 dark:border-gray-800">
                {TIME_SLOTS.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-gray-200 dark:border-gray-800 p-2 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {hour.toString().padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Schedule Columns */}
              {DAYS.map((day, dayIndex) => (
                <div
                  key={day}
                  className="relative border-r last:border-r-0 border-gray-200 dark:border-gray-800"
                >
                  {/* Time slots background */}
                  {TIME_SLOTS.map((hour) => (
                    <div
                      key={hour}
                      className="h-16 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    />
                  ))}

                  {/* Schedule cards */}
                  <div className="absolute inset-0 p-1">
                    {schedulesByDay[day].map((schedule, index) => {
                      const style = getScheduleStyle(schedule);
                      const colorClass = getScheduleColor(index);

                      return (
                        <div
                          key={schedule.scheduleId}
                          className={`absolute left-1 right-1 ${colorClass} border-l-4 rounded-lg p-2 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden`}
                          style={style}
                          onClick={() => onScheduleClick?.(schedule)}
                        >
                          <div className="text-white">
                            <div className="font-bold text-sm truncate">
                              {schedule.subjectName || schedule.subjectId}
                            </div>
                            <div className="text-xs opacity-90 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                            </div>
                            <div className="text-xs opacity-90 flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3" />
                              {schedule.roomName || schedule.roomId}
                            </div>
                            <div className="text-xs opacity-90 flex items-center gap-1 truncate">
                              <GraduationCap className="w-3 h-3" />
                              {schedule.teacherName || schedule.teacherId}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Day Selector */}
      <div className="lg:hidden">
        {/* Day Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium transition-colors ${
                (selectedDay || DAYS[0]) === day
                  ? "bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <div className="text-center">
                <div>{day.slice(0, 3)}</div>
                <div className="text-xs mt-1">{schedulesByDay[day].length} classes</div>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Schedule List */}
        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
          {schedulesByDay[selectedDay || DAYS[0]].length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No classes scheduled</p>
            </div>
          ) : (
            schedulesByDay[selectedDay || DAYS[0]].map((schedule, index) => {
              const colorClass = getScheduleColor(index);
              return (
                <div
                  key={schedule.scheduleId}
                  className={`${colorClass} border-l-4 rounded-lg p-4 shadow-md hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => onScheduleClick?.(schedule)}
                >
                  <div className="text-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-bold text-base">
                        {schedule.subjectName || schedule.subjectId}
                      </div>
                      <Badge size="sm"  variant="solid" >
                        {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm opacity-90">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{schedule.sectionName || schedule.sectionId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{schedule.teacherName || schedule.teacherId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.roomName || schedule.roomId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Click on a class to view details</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Color-coded by class</span>
          </div>
        </div>
      </div>
    </div>
  );
}