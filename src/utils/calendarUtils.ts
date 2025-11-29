// src/utils/calendarUtils.ts
import { Schedule } from "@/types/Schedule";


export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

export const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const checkScheduleConflict = (
  newEvent: Schedule,
  events: Schedule[],
  isUpdate = false
): string | null => {
  const newStart = timeToMinutes(newEvent.startTime);
  const newEnd = timeToMinutes(newEvent.endTime);

  if (newStart >= newEnd) return "End time must be after start time.";

  for (const ev of events) {
    if (isUpdate && ev.scheduleId === newEvent.scheduleId) continue;

    const evStart = timeToMinutes(ev.startTime);
    const evEnd = timeToMinutes(ev.endTime);

    if (ev.dayOfWeek === newEvent.dayOfWeek) {
      const overlap =
        (newStart >= evStart && newStart < evEnd) ||
        (newEnd > evStart && newEnd <= evEnd) ||
        (newStart <= evStart && newEnd >= evEnd);

      if (overlap) {
        if (ev.roomId === newEvent.roomId) {
          return `Conflict: Room ${newEvent.roomId} is booked on ${newEvent.dayOfWeek} from ${ev.startTime} to ${ev.endTime}.`;
        }
        if (ev.teacherId === newEvent.teacherId) {
          return `Conflict: Teacher ${newEvent.teacherId} is booked on ${newEvent.dayOfWeek} from ${ev.startTime} to ${ev.endTime}.`;
        }
      }
    }
  }
  return null;
};