import { useMutation, useQueryClient } from "@tanstack/react-query";

const useEditEmployee = () => {
  const queryClient = useQueryClient(); // Get queryClient instance

  return useMutation({
    mutationFn: async (employeeData: {
      id: string;
      FirstName: string;
      LastName: string;
      groupName: string;
      role: string;
      expectedSalary: string;
      expectedDateOfDefense: string;
    }) => {
      // Ensure expectedDateOfDefense is in "YYYY-MM-DD"
      const formattedEmployeeData = {
        ...employeeData,
        expectedDateOfDefense: new Date(employeeData.expectedDateOfDefense)
          .toISOString()
          .split("T")[0], // Converts ISO Date to YYYY-MM-DD
      };

      const response = await fetch(
        `http://localhost:5000/employees/update/${employeeData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedEmployeeData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      console.log("✅ Employee updated, refreshing list...");
      queryClient.invalidateQueries({ queryKey: ["employees"] }); 
    },
  });
};

export default useEditEmployee;