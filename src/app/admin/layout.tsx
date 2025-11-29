"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import ReactQueryProvider from "@/utils/ReactQueryProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
     <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
         <ReactQueryProvider>
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
        </ReactQueryProvider>
      </div>
      </ProtectedRoute>
    </div>
  );
}
