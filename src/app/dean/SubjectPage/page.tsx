import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SubjectTable from "@/components/tables/AdminTables/SubjectsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Subjects - SCSIT",
  description:
    "This is a subject page for SCSIT APP",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Subjects Overview" />
      <div className="space-y-6">
        <ComponentCard title="Manage subjects at Salazar Colleges of Science and Institute of Technology">
          <SubjectTable />

        </ComponentCard>
      </div>
    </div>
  );
}
