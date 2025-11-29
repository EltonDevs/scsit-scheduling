import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/AdminTables/TeachersTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
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
