
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { deanData } from "@/data/dean";
import BackButton from "@/components/ui/button/BackIcon";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const {id} = await params;

  const User = deanData.find((t) => t.id === id);

  if (!User) {
    return <div className="text-red-500">User not found.</div>;
  }

  return (
    <div>
        <PageBreadcrumb pageTitle="Dean's Profile" />
     <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Profile of {User.name}
          </h3>
          <BackButton />
        </div>
        <div className="space-y-6">
          <UserMetaCard User={User} />
          <UserInfoCard User={User} />
          <UserAddressCard User={User} />
        </div>
      </div>

    </div>
  );
}
