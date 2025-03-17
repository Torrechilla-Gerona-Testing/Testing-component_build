"use client";
import React, { useState } from 'react';
import useAddEmployee from '../hook/useAddEmployee';

// Define the props interface for AddEmployee
interface AddEmployeeProps {
  refetch: () => void; // 🔄 Function to refresh employee list
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ refetch }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        groupName: '',
        role: '',
        expectedSalary: '',
        expectedDateOfDefense: '',
    });

    const { mutateAsync: addEmployee, isPending, error, isSuccess } = useAddEmployee();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formattedDate = new Date(formData.expectedDateOfDefense.split('/').reverse().join('-')).toISOString();

            // Create the payload with the correct property names
            const payload = {
                FirstName: formData.firstName,
                LastName: formData.lastName,
                groupName: formData.groupName,
                role: formData.role,
                expectedSalary: formData.expectedSalary,
                expectedDateOfDefense: formattedDate,
            };

            const result = await addEmployee(payload);

            if (result) {
                alert('Employee added successfully!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    groupName: '',
                    role: '',
                    expectedSalary: '',
                    expectedDateOfDefense: '',
                });
                refetch(); // 🔄 Refresh the employee list
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add employee');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Group Name:</label>
                <input
                    type="text"
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Role:</label>
                <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Expected Salary:</label>
                <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Expected Date of Defense:</label>
                <input
                    type="date"
                    name="expectedDateOfDefense"
                    value={formData.expectedDateOfDefense}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Employee'}
            </button>
            {error && <p style={{ color: 'red' }}>{error.message}</p>}
            {isSuccess && <p style={{ color: 'green' }}>Employee added successfully!</p>}
        </form>
    );
};

export default AddEmployee;