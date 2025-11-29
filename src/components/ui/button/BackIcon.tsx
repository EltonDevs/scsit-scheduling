"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="ml-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </button>
  );
}
