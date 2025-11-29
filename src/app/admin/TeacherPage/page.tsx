import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/AdminTables/TeachersTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Teachers - SCSIT",
  description:
    "This is a teacher page for SCSIT APP",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Teacher Overview" />
      <div className="space-y-6">
        <ComponentCard title="Manage teachers at Salazar Colleges of Science and Institute of Technology">
          <BasicTableOne />

        </ComponentCard>
      </div>
    </div>
  );
}
