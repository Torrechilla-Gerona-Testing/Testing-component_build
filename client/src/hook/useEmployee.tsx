import { useQuery } from '@tanstack/react-query';

interface Employee {
    id: number;
    FirstName: string;
    LastName: string;
    groupName: string;
    role: string;
    expectedSalary: string;
    expectedDateOfDefense: string;
}

const useEmployees = () => {
    return useQuery<Employee[], Error>({
        queryKey: ['employees'], 
        queryFn: async () => {
            console.log("Fetching employees..."); 
            const response = await fetch('http://localhost:5000/employees');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Employees fetched:", data); 
            return data;
        },
    });
};

export default useEmployees;