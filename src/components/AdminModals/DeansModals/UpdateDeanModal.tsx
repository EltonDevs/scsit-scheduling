"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Image from "next/image";
import { Dean } from "@/services/deanService";


interface UpdateTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  dean: Dean | null;
  onSave?: (dean: Dean) => void;
}

export default function UpdateDeanModal({
  isOpen,
  onClose,
  dean,
  onSave,
}: UpdateTeacherModalProps) {
  const [formData, setFormData] = useState<Dean | null>(null);

  useEffect(() => {
    if (dean) {
      setFormData({
        ...dean,
        phone: dean.phone || "",
        assigned_since: dean.assigned_since || "",
      });
    }
  }, [dean]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    if (name === "isActive") {
      setFormData({ ...formData, isActive: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    if (formData && onSave) {
      onSave({
        ...formData,
        phone: formData.phone || null,
        assigned_since: formData.assigned_since || null,
      });
    }
    onClose();
  };

  if (!formData) return null;

  const [firstName, ...lastNameParts] = formData.firstName.split(" ");
  const lastName = lastNameParts.join(" ");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-2xl p-6 md:p-10 rounded-xl bg-white dark:bg-gray-900 shadow-xl"
      aria-labelledby="update-teacher-modal-title"
    >
      <form className="space-y-8">
        <h2
          id="update-teacher-modal-title"
          className="text-xl font-semibold text-gray-800 dark:text-white"
        >
          Update Teacher Information
        </h2>

        {/* Profile Picture Preview */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow">
            {formData.profile_picture ? (
              <Image
                src={formData.profile_picture}
                // alt={formData.firstName}
                alt={`${formData.firstName} ${formData.lastName}`}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                No Image
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {formData.firstName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.departmentId}
            </p>
          </div>
        </div>

        {/* Name Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label>First Name</Label>
            <Input
              name="firstName"
              value={firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  firstName: `${e.target.value} ${lastName}`.trim(),
                })
              }
              placeholder="First Name"
            />
          </div>

          <div>
            <Label>Last Name</Label>
            <Input
              name="lastName"
              value={lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastName: `${firstName} ${e.target.value}`.trim(),
                })
              }
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              type="text"
              name="phone_number"
              value={formData.phone || undefined}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Role Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label>Department</Label>
            <Input
              type="text"
              name="department"
              value={formData.departmentId}
              onChange={handleInputChange}
              placeholder="Department"
            />
          </div>

          <div>
            <Label>Role</Label>
            <Input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Role"
            />
          </div>
        </div>

        {/* Assignment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label>Assigned Since</Label>
            <Input
              type="date"
              name="assigned_since"
              value={formData.assigned_since || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              name="is_active"
              value={formData.isActive ? "true" : "false"}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-brand-500 text-white hover:bg-brand-600"
            aria-label="Save changes"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
