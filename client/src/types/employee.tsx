export interface EmployeeCardProps {
    id?: number | string;
    FirstName?: string;
    LastName?: string;
    groupName: string;
    role: string;
    expectedSalary: string | number;
    expectedDateOfDefense: string;
}