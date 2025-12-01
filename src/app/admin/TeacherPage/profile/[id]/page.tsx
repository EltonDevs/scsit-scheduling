// app/teachers/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BackButton from "@/components/ui/button/BackIcon";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
// import UserAddressCard from "@/components/user-profile/UserAddressCard";
import Spinner from "@/components/loading/Spinner";
import { getTeacherById, Teacher } from "@/services/teacherService";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProfilePage({ params }: PageProps) {
  // Unwrap the params promise
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  
  const [user, setUser] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTeacher() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTeacherById(id);
        
        if (isMounted) {
          setUser(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Failed to fetch teacher:", err);
          setError(err instanceof Error ? err.message : "Failed to load teacher");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchTeacher();
    } else {
      setError("Invalid teacher ID");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" color="text-brand-500" />
        <span className="ml-2">Loading teacher profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-red-500 text-center p-8">
        Teacher not found.
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Teacher's Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Profile of {user.firstName} {user.lastName}
          </h3>
          <BackButton />
        </div>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
          {/* <UserAddressCard user={user} /> */}
        </div>
      </div>
    </div>
  );
}