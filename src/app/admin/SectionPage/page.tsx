import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SectionTable from "@/components/tables/AdminTables/SectionsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sections - SCSIT",
  description:
    "This is a section page for SCSIT APP",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Sections Overview" />
      <div className="space-y-6">
        <ComponentCard title="Manage sections at Salazar Colleges of Science and Institute of Technology">
          <SectionTable />

        </ComponentCard>
      </div>
    </div>
  );
}
