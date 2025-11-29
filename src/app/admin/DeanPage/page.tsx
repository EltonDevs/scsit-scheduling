import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/AdminTables/DeansTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Deans - SCSIT",
  description:
    "This is a dean page for SCSIT APP",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dean Overview" />
      <div className="space-y-6">
        <ComponentCard title="Manage Dean at Salazar Colleges of Science and Institute of Technology">
          <BasicTableOne />

        </ComponentCard>
      </div>
    </div>
  );
}
