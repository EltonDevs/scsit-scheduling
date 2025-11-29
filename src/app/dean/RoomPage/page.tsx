import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import RoomTable from "@/components/tables/AdminTables/RoomTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Rooms - SCSIT",
  description:
    "This is a room page for SCSIT APP",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Rooms Overview" />
      <div className="space-y-6">
        <ComponentCard title="Manage rooms at Salazar Colleges of Science and Institute of Technology">
          <RoomTable />

        </ComponentCard>
      </div>
    </div>
  );
}
