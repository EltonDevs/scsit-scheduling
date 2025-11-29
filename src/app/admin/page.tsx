
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

export const metadata: Metadata = {
  title: "SCSIT - Scheduling App",
  description: "This is SCSIT-Scheduling App",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-8">
      <div className="col-span-12 space-y-4 sm:space-y-5 xl:col-span-12">
        <EcommerceMetrics />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 md:gap-4 col-span-12 md:col-span-12 xl:col-span-12 min-h-[450px]">
        <div className="h-full">
          <MonthlySalesChart />
        </div>
        <div className="h-full">
          <MonthlyTarget />
        </div>
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 md:col-span-6 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 md:col-span-6 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}