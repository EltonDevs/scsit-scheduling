import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CourseTable from "@/components/tables/AdminTables/CourseTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Course - SCSIT",
  description:
    "This is a course page for SCSIT APP",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Courses Overview" />
      <div className="space-y-6">
        <ComponentCard title="Manage courses at Salazar Colleges of Science and Institute of Technology">
          <CourseTable />

        </ComponentCard>
      </div>
    </div>
  );
}
