'use client';
import React, { useState } from 'react';
import Header from '../../components/header';
import AddEmployee from '../../components/addEmployeeForm'; 
import useEmployees from '../../hook/useEmployee'; 
import EmployeeList from '../../components/employeeListCard';

export default function Home() {
    const [showAddEmployee, setShowAddEmployee] = useState(false); 

 
    const { data: employees, isLoading, isError, error, refetch } = useEmployees();


    const entryLevelEmployees = employees?.filter(
        (employee) => parseFloat(employee.expectedSalary) < 50000
    );
    const seniorLevelEmployees = employees?.filter(
        (employee) => parseFloat(employee.expectedSalary) >= 50000
    );

    const toggleAddEmployee = () => {
        setShowAddEmployee(!showAddEmployee); 
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">Loading...</div>;
    if (isError) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 text-red-500">Error: {error.message}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 flex flex-col">
       
            <div className="flex justify-between items-center p-4 bg-white shadow-md">
                <Header text="Prutas" Image="/01.png" />
                <button
                    onClick={toggleAddEmployee}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-lg"
                >
                    {showAddEmployee ? '−' : '+'}
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <h1 className="text-3xl font-bold text-blue-900 mb-4">Welcome to Prutas!</h1>
                <p className="text-center text-gray-700 mb-8">
                    Prutas is a simple CRUD application that allows you to create, read, update, and delete posts.
                </p>

               
                {showAddEmployee && <AddEmployee refetch={refetch} />}

                <div className="w-full max-w-7xl">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">Entry Level Employees</h2>
                    <EmployeeList key={employees?.length} employees={entryLevelEmployees} refetch={refetch} />
                </div>

                <div className="w-full max-w-7xl mt-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">Senior Level Employees</h2>
                    <EmployeeList key={employees?.length} employees={seniorLevelEmployees} refetch={refetch} />
                </div>
            </div>
        </div>
    );
}