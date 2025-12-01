// PrintableScheduleCalendar.tsx
import React from "react";
import type { Schedule } from "@/types/Schedule";

interface PrintableScheduleCalendarProps {
  schedules: Schedule[];
  filters: {
    search?: string;
    course?: string;
    subject?: string;
    teacher?: string;
    room?: string;
    day?: string;
  };
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
const TIME_SLOTS = Array.from({ length: 14 }, (_, i) => i + 7);

export function PrintableScheduleCalendar({ schedules, filters }: PrintableScheduleCalendarProps) {
  const schedulesByDay: Record<string, Schedule[]> = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
  };

  schedules.forEach((schedule) => {
    if (schedulesByDay[schedule.dayOfWeek]) {
      schedulesByDay[schedule.dayOfWeek].push(schedule);
    }
  });

  Object.keys(schedulesByDay).forEach((day) => {
    schedulesByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  const getSchedulePosition = (schedule: Schedule) => {
    const startHour = parseInt(schedule.startTime.split(":")[0]);
    const startMinute = parseInt(schedule.startTime.split(":")[1]);
    const endHour = parseInt(schedule.endTime.split(":")[0]);
    const endMinute = parseInt(schedule.endTime.split(":")[1]);

    const startOffset = (startHour - 7) * 60 + startMinute;
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

    return {
      top: `${(startOffset / 60) * 50}px`,
      height: `${(duration / 60) * 50}px`,
    };
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== "");

  return (
    <div className="print-only">
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0.5cm;
          }
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>Weekly Class Schedule</h1>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666" }}>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
          Total Classes: {schedules.length}
        </p>

        {hasActiveFilters && (
          <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
            <strong style={{ fontSize: "12px" }}>Active Filters:</strong>
            <div style={{ fontSize: "11px", marginTop: "4px" }}>
              {filters.search && <span>Search: &quot;{filters.search}&quot; | </span>}
              {filters.course && <span>Course: {filters.course} | </span>}
              {filters.subject && <span>Subject: {filters.subject} | </span>}
              {filters.teacher && <span>Teacher: {filters.teacher} | </span>}
              {filters.room && <span>Room: {filters.room} | </span>}
              {filters.day && <span>Day: {filters.day}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div style={{ border: "1px solid #000" }}>
        {/* Days Header */}
        <div style={{ display: "grid", gridTemplateColumns: "80px repeat(6, 1fr)", borderBottom: "1px solid #000" }}>
          <div style={{ padding: "8px", backgroundColor: "#f5f5f5", borderRight: "1px solid #000", fontWeight: "bold", fontSize: "11px" }}>
            Time
          </div>
          {DAYS.map((day) => (
            <div
              key={day}
              style={{
                padding: "8px",
                backgroundColor: "#f5f5f5",
                borderRight: day !== "SATURDAY" ? "1px solid #000" : "none",
                fontWeight: "bold",
                fontSize: "11px",
                textAlign: "center",
              }}
            >
              <div>{day}</div>
              <div style={{ fontSize: "9px", marginTop: "2px", fontWeight: "normal" }}>
                ({schedulesByDay[day].length} classes)
              </div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "80px repeat(6, 1fr)" }}>
          {/* Time Column */}
          <div style={{ borderRight: "1px solid #000" }}>
            {TIME_SLOTS.map((hour) => (
              <div
                key={hour}
                style={{
                  height: "50px",
                  padding: "4px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "10px",
                  backgroundColor: "#fafafa",
                }}
              >
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Schedule Columns */}
          {DAYS.map((day, index) => (
            <div
              key={day}
              style={{
                position: "relative",
                borderRight: index !== 5 ? "1px solid #000" : "none",
              }}
            >
              {TIME_SLOTS.map((hour) => (
                <div
                  key={hour}
                  style={{
                    height: "50px",
                    borderBottom: "1px solid #ddd",
                  }}
                />
              ))}

              {/* Schedule Cards */}
              {schedulesByDay[day].map((schedule, idx) => {
                const position = getSchedulePosition(schedule);
                return (
                  <div
                    key={schedule.scheduleId}
                    style={{
                      position: "absolute",
                      left: "2px",
                      right: "2px",
                      ...position,
                      border: "1px solid #000",
                      padding: "4px",
                      fontSize: "9px",
                      overflow: "hidden",
                      backgroundColor: idx % 2 === 0 ? "#e3f2fd" : "#f3e5f5",
                    }}
                  >
                    <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
                      {schedule.subjectName || schedule.subjectId}
                    </div>
                    <div style={{ fontSize: "8px" }}>
                      ⏰ {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                    </div>
                    <div style={{ fontSize: "8px" }}>
                      📍 {schedule.roomName || schedule.roomId}
                    </div>
                    <div style={{ fontSize: "8px" }}>
                      👨‍🏫 {schedule.teacherName || schedule.teacherId}
                    </div>
                    <div style={{ fontSize: "8px" }}>
                      👥 {schedule.sectionName || schedule.sectionId}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// PrintableScheduleList.tsx
interface PrintableScheduleListProps {
  schedules: Schedule[];
  filters: {
    search?: string;
    course?: string;
    subject?: string;
    teacher?: string;
    room?: string;
    day?: string;
  };
}

export function PrintableScheduleList({ schedules, filters }: PrintableScheduleListProps) {
  const hasActiveFilters = Object.values(filters).some(v => v && v !== "");

  return (
    <div className="print-only">
      <style>{`
        @media print {
          @page {
            size: portrait;
            margin: 1cm;
          }
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>Class Schedule List</h1>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666" }}>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
          Total Classes: {schedules.length}
        </p>

        {hasActiveFilters && (
          <div style={{ marginTop: "10px", padding: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
            <strong style={{ fontSize: "12px" }}>Active Filters:</strong>
            <div style={{ fontSize: "11px", marginTop: "4px" }}>
              {filters.search && <span>Search: &quot;{filters.search}&quot; | </span>}
              {filters.course && <span>Course: {filters.course} | </span>}
              {filters.subject && <span>Subject: {filters.subject} | </span>}
              {filters.teacher && <span>Teacher: {filters.teacher} | </span>}
              {filters.room && <span>Room: {filters.room} | </span>}
              {filters.day && <span>Day: {filters.day}</span>}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>#</th>
            <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Subject</th>
            <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Teacher</th>
            <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Room</th>
            <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Section</th>
            <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Day</th>
            <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <tr key={schedule.scheduleId} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
              <td style={{ border: "1px solid #ddd", padding: "6px" }}>{index + 1}</td>
              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                {schedule.subjectName || schedule.subjectId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                {schedule.teacherName || schedule.teacherId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                {schedule.roomName || schedule.roomId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                {schedule.sectionName || schedule.sectionId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                {schedule.dayOfWeek}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {schedules.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          No schedules to print
        </div>
      )}
    </div>
  );
}