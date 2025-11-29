
import ScheduleListTable from "@/components/calendar/calendarList";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "SCSIT Calender | SCSIT - Scheduling App",
  description:
    "This is SCSIT Calender page for SCSIT Scheduling App",
  // other metadata
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Calendar Lists" />
         <ScheduleListTable />
      {/* <h1 className="text-white ">This page is under construction</h1> */}
    </div>
  );
}
