import ScheduleCalendarPage from "@/components/calendar/ScheduleCalendarPage";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SCSIT Calendar | SCSIT - Scheduling App",
  description: "View all class schedules in a weekly calendar format",
};

export default function CalendarPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Schedule Calendar" />
      <ScheduleCalendarPage />
    </div>
  );
}