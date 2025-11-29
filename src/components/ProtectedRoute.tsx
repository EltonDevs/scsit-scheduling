"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/signin");
        return;
      }

      if (allowedRoles) {
        const userRoles = Array.isArray(user.role)
          ? user.role.map((r) => r.replace(/[\[\]]/g, ""))
          : [user.role.replace(/[\[\]]/g, "")];

        const hasAccess = userRoles.some((r) => allowedRoles.includes(r));
        if (!hasAccess) {
          router.push("/error-401");
          return;
        }
      }

      setChecked(true);
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !checked) {
  return (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 z-50 gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-dashed rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        );
  }

  return <>{children}</>;
}