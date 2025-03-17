import { useMutation } from '@tanstack/react-query';

const useAddEmployee = () => {
    return useMutation({
        mutationFn: async (employeeData: {
            FirstName: string;
            LastName: string;
            groupName: string;
            role: string;
            expectedSalary: string;
            expectedDateOfDefense: string;
        }) => {
            try {
                const response = await fetch('http://localhost:5000/employees/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(employeeData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            } catch (error) {
                console.error('Fetch error:', error);
                throw new Error('Failed to add employee');
            }
        },
    });
};

export default useAddEmployee;