"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import { useModal } from "@/hooks/useModal";

export default function SubjectFormInModal() {
  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving subject changes...");
    closeModal();
  };

  // Mock data for Course and Semester
  const mockCourses = [
    { id: "1", name: "Computer Science" },
    { id: "2", name: "Mathematics" },
    { id: "3", name: "Physics" },
  ];

  const mockSemesters = [
    { id: "1", name: "Fall 2025" },
    { id: "2", name: "Spring 2026" },
    { id: "3", name: "Summer 2026" },
  ];

  return (
    <ComponentCard title="Subject Form In Modal">
      <Button size="sm" onClick={openModal}>
        Open Subject Modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form className="">
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Subject Information
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Subject Code</Label>
              <Input
                type="text"
                placeholder="SUBJ101"
           
              />
            </div>

            <div className="col-span-1">
              <Label>Subject Name</Label>
              <Input
                type="text"
                placeholder="Introduction to Programming"
            
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Label>Description</Label>
              <Input
                type="text"
                placeholder="Course description"
              />
            </div>

            <div className="col-span-1">
              <Label>Course</Label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
                required
              >
                <option value="" disabled>Select Course</option>
                {mockCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <Label>Semester</Label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
                required
              >
                <option value="" disabled>Select Semester</option>
                {mockSemesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <Label>Credit Units</Label>
              <Input
                type="number"
                placeholder="3"
                min="1"
             
              />
            </div>

            <div className="col-span-1">
              <Label>Year Level</Label>
              <Input
                type="number"
                placeholder="1"
                min="1"
                max="5"
              />
            </div>

            <div className="col-span-1">
              <Label>Type</Label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white/90 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue=""
                required
              >
                <option value="" disabled>Select Type</option>
                <option value="MAJOR">Major</option>
                <option value="MINOR">Minor</option>
                <option value="LAB">Lab</option>
                <option value="SEMINAR">Seminar</option>
              </select>
            </div>

            <div className="col-span-1 flex items-center gap-3">
              <Label>Is Shared</Label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isShared"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="col-span-1 flex items-center gap-3">
              <Label>Is Active</Label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isActive"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </ComponentCard>
  );
}