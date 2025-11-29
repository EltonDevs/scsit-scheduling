"use client";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import dynamic from "next/dynamic";
const CampusMap = dynamic(() => import("./CampusMap"), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />,
});


export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            Campuses Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-xs dark:text-gray-400 sm:text-sm">
            Number of campuses in Cebu, Philippines
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreHorizontal className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5 sm:size-6" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="my-6">
        <CampusMap />
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={48}
                height={48}
                src="/images/country/logo-SCSIT.svg"
                alt="SCSIT-Main Campus"
                className="w-full"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm dark:text-white/90 sm:text-base">
                SCSIT-Main Campus
              </p>
              <span className="block text-gray-500 text-xs dark:text-gray-400 sm:text-sm">
                2,379 Students
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 flex h-full w-[79%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
            </div>
            <p className="font-medium text-gray-800 text-sm dark:text-white/90 sm:text-base">
              79%
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={48}
                height={48}
                className="w-full"
                src="/images/country/logo-SCSIT.svg"
                alt="SCSIT-DaanBantayan Campus"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm dark:text-white/90 sm:text-base">
                SCSIT-DaanBantayan Campus
              </p>
              <span className="block text-gray-500 text-xs dark:text-gray-400 sm:text-sm">
                589 Students
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 flex h-full w-[23%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
            </div>
            <p className="font-medium text-gray-800 text-sm dark:text-white/90 sm:text-base">
              23%
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <Image
                width={48}
                height={48}
                className="w-full"
                src="/images/country/logo-SCSIT.svg"
                alt="SCSIT-Talisay Campus"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm dark:text-white/90 sm:text-base">
                SCSIT-Talisay Campus
              </p>
              <span className="block text-gray-500 text-xs dark:text-gray-400 sm:text-sm">
                1,000 Students
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-[140px] items-center gap-3">
            <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
              <div className="absolute left-0 top-0 flex h-full w-[50%] items-center justify-center rounded-sm bg-brand-500 text-xs font-medium text-white"></div>
            </div>
            <p className="font-medium text-gray-800 text-sm dark:text-white/90 sm:text-base">
              50%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}