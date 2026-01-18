import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReptil } from "../api/ReptilApi";
import { toast } from "react-toastify";

export function useCreateReptil(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReptil,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reptiles"] });
      toast.success(data);
      onSuccess?.();
    },
  });
}
