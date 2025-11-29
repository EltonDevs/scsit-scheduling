"use client";

import React from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "@/components/form/input/InputField";

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: {
    code: string;
    name: string;
    createdAt: string;
    status: "ACTIVE" | "INACTIVE";
  } | null;
}

export default function ViewDepartmentModal({
  isOpen,
  onClose,
  department,
}: ViewDepartmentModalProps) {
  if (!department) return null;
  // console.log(department);

  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[584px] p-5 lg:p-10"
      aria-modal="true"
      aria-labelledby="add-department-modal-title"
    >
      <form>
        <h4
          id="view-department-modal-title"
          className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90"
        >
          {department.code} Department
        </h4>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label htmlFor="code">Department Code</Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="CS"
              defaultValue={department.code}
              aria-describedby="code-error"
              disabled
            />
         
          </div>
          <div className="col-span-1">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Computer Science"
              defaultValue={department.name}
              disabled
             
              aria-describedby="name-error"
            />
          
          </div>
           <div className="col-span-1">
            <Label htmlFor="name">Created at</Label>
            <Input
              id="created_at"
              name="created_at"
              type="text"
          
              defaultValue={new Date(department.createdAt).toLocaleString()}
              disabled
             
              aria-describedby="name-error"
            />
          
          </div>

          <div className="col-span-1">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
             
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                  department.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    department.status === "ACTIVE"
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {/* {formData.status} */}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          {/* <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button> */}
        </div>
      </form>
    </Modal>
  );
}
