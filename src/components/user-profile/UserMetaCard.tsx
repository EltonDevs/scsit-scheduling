"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";

export default function UserMetaCard({ User }) {
  const { isOpen, openModal, closeModal } = useModal();

  // State for form data, initialized with user props
  const [formData, setFormData] = useState({
    fullName: User.name || "",
    email: User.email || "",
    phone: User.phone_number || "",
    bio: User.role || "",
    department: User.department || "",
    profilePicture: User.profile_picture || "/images/user/default.jpg", // Current profile picture URL
  });

  // State for profile picture preview and file
  const [preview, setPreview] = useState(formData.profilePicture);
  const [file, setFile] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload for profile picture
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      setFormData((prev) => ({ ...prev, profilePicture: objectUrl })); // Update formData for consistency
    }
  };

  // Handle save (simulate API call; in production, upload file to server)
  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Implement actual save logic, e.g., API call with formData and file
    // For file upload: Use FormData to send file to backend
    console.log("Saving changes:", { ...formData, file });
    closeModal();
    // Optionally revoke preview URL: URL.revokeObjectURL(preview);
  };

  // Dropdown options
  const roleOptions = [
    { value: "", label: "Select a position" },
    { value: "Dean", label: "Dean" },
    { value: "Professor", label: "Professor" },
    { value: "Assistant Professor", label: "Assistant Professor" },
    { value: "Lecturer", label: "Lecturer" },
    { value: "Administrator", label: "Administrator" },
  ];

  const departmentOptions = [
    { value: "", label: "Select a department" },
    { value: "Engineering", label: "Engineering" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Physics", label: "Physics" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "Humanities", label: "Humanities" },
  ];

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={User.profile_picture || "/images/user/default.jpg"}
                alt={`${User.name}'s avatar`}
                className="object-cover"
              />
            </div>
            <div className="order-3 xl:order-2 text-center xl:text-left">
              <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                {User.name}
              </h4>
              <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {User.role || "N/A"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {User.email || "N/A"}
                </p>
              </div>
            </div>
            {/* Uncomment and adapt if social links are needed
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              // Social icons here
            </div>
            */}
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto transition-colors duration-200"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 w-full max-w-3xl">
        <div className="relative w-full overflow-hidden rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10 shadow-xl">
          <div className="mb-6">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Update your details to keep your profile up-to-date. Changes will reflect after saving.
            </p>
          </div>
          <form onSubmit={handleSave} className="flex flex-col">
            <div className="custom-scrollbar max-h-[70vh] overflow-y-auto px-2 pb-6 space-y-8">
              {/* Profile Picture Section */}
              <div>
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                  Profile Picture
                </h5>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  <div className="w-32 h-32 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 shadow-md">
                    <Image
                      src={preview}
                      alt="Profile preview"
                      width={200}
                      height={148}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    <Label htmlFor="profilePicture">Upload New Picture</Label>
                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-gray-800 dark:file:text-gray-400 dark:hover:file:bg-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-400">Recommended: Square image, max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Position</Label>
                    <select
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="department">Department</Label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    >
                      {departmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end border-t pt-4 dark:border-gray-800">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}