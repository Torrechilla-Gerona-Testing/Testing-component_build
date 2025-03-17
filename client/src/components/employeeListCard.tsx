"use client";
import React from "react";
import EmployeeCard from "./employeeCard";
import { EmployeeCardProps } from "../types/employee";

interface EmployeeListProps {
  employees?: EmployeeCardProps[];
  refetch: () => void; 
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, refetch }) => {
  if (!employees || employees.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-gray-200 font-semibold text-lg">No employees found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Employee Directory</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              {...employee} 
              refetch={refetch} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;