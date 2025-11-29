"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDown, ArrowUp, BookA, BookDashed, BoxIcon, Calendar, Home, NotebookTabs, User2, Users } from "lucide-react";

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <BoxIcon className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>

        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Departments
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              7
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="size-4 sm:size-5" />
            11.01%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <User2 className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Deans
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              7
            </h4>
          </div>
          <Badge color="error">
            <ArrowDown className="size-4 text-error-500 sm:size-5" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <Users className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Teachers
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              50
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="size-4 sm:size-5" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <BookA className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Courses
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              7
            </h4>
          </div>
          <Badge color="error">
            <ArrowDown className="size-4 text-error-500 sm:size-5" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <BookDashed className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Subjects
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              800
            </h4>
          </div>
          <Badge color="error">
            <ArrowDown className="size-4 text-error-500 sm:size-5" />
            9.05%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <Home className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Rooms
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              98
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="size-4 sm:size-5" />
            11.01%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <NotebookTabs className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Sections
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              82
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="size-4 sm:size-5" />
            11.01%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-5 md:p-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl dark:bg-gray-800 sm:w-12 sm:h-12">
          <Calendar className="text-gray-800 size-5 dark:text-white/90 sm:size-6" />
        </div>
        <div className="flex items-end justify-between mt-4 sm:mt-5">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Schedules
            </span>
            <h4 className="mt-1 font-bold text-gray-800 text-3xl dark:text-white/90 sm:text-title-sm lg:text-3xl">
              3,782
            </h4>
          </div>
          <Badge color="success">
            <ArrowUp className="size-4 sm:size-5" />
            11.01%
          </Badge>
        </div>
      </div>
      {/* Metric Item End */}
    </div>
  );
};