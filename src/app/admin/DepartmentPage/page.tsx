import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DepartmentTable from "@/components/tables/AdminTables/DepartmentTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Department - SCSIT",
  description:
    "This is a department page for SCSIT APP",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Department Overview" />
      <div className="space-y-6">
        <ComponentCard title="Manage departments at Salazar Colleges of Science and Institute of Technology">
          <DepartmentTable />

        </ComponentCard>
      </div>
    </div>
  );
}
