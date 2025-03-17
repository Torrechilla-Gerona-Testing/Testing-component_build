import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteEmployee = () => {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `http://localhost:5000/employees/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      console.log("✅ Employee deleted, refreshing list...");
      queryClient.invalidateQueries({ queryKey: ["employees"] }); 
    },
  });
};

export default useDeleteEmployee;