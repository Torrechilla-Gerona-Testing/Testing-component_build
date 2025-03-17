"use client";
import React, { useState } from "react";
import { EmployeeCardProps } from "../types/employee";
import useDeleteEmployee from "../hook/useDeleteEmployee";
import useEditEmployee from "../hook/useEditEmployee";

interface EmployeeCardComponentProps extends EmployeeCardProps {
  refetch: () => void; 
}

const EmployeeCard: React.FC<EmployeeCardComponentProps> = ({
  id,
  FirstName = "",
  LastName = "",
  groupName,
  role,
  expectedSalary,
  expectedDateOfDefense,
  refetch, 
}) => {
  const deleteEmployee = useDeleteEmployee();
  const editEmployee = useEditEmployee();
  const [isEditing, setIsEditing] = useState(false);


  const formatDate = (isoDate: string) =>
    isoDate ? new Date(isoDate).toISOString().split("T")[0] : "";

  const [formData, setFormData] = useState({
    FirstName,
    LastName,
    groupName,
    role,
    expectedSalary: String(expectedSalary),
    expectedDateOfDefense: formatDate(expectedDateOfDefense),
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      console.error("❌ Error: Employee ID is undefined");
      return;
    }

    try {
      console.log("🔄 Updating employee...", formData);

      await editEmployee.mutateAsync(
        {
          id: String(id),
          FirstName: formData.FirstName.trim(),
          LastName: formData.LastName.trim(),
          groupName: formData.groupName.trim(),
          role: formData.role.trim(),
          expectedSalary: formData.expectedSalary,
          expectedDateOfDefense: new Date(
            formData.expectedDateOfDefense
          ).toISOString(), 
        },
        {
          onSuccess: () => {
            console.log("✅ Employee updated successfully!");
            refetch(); 
            setIsEditing(false);
          },
        }
      );
    } catch (error) {
      console.error("❌ Error updating employee:", error);
    }
  };


  const handleDelete = () => {
    if (!id) {
      console.error("Error: Employee ID is undefined");
      return;
    }

    if (confirm(`Are you sure you want to delete ${FirstName} ${LastName}?`)) {
      deleteEmployee.mutate(String(id), {
        onSuccess: () => {
          console.log("✅ Employee deleted successfully!");
          refetch(); 
        },
      });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="number"
            name="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
          <input
            type="date"
            name="expectedDateOfDefense"
            value={formData.expectedDateOfDefense} 
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
            required
          />

          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              disabled={editEmployee.isPending} 
            >
              {editEmployee.isPending ? "Saving..." : "Save"} 
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white mb-2">
            {FirstName} {LastName}
          </h2>
          <p className="text-sm text-gray-300 mb-1">
            <strong>Group:</strong> {groupName}
          </p>
          <p className="text-sm text-gray-300 mb-1">
            <strong>Role:</strong> {role}
          </p>
          <p className="text-sm text-gray-300 mb-1">
            <strong>Expected Salary:</strong> ${expectedSalary}
          </p>
          <p className="text-sm text-gray-300">
            <strong>Expected Date of Defense:</strong>{" "}
            {formatDate(expectedDateOfDefense)}
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeCard;