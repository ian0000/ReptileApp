import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReptil } from "../api/ReptilApi";
import { toast } from "react-toastify";

export function useCreateReptil(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReptil,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reptiles"] });
      toast.success(successMessage(data, "Reptil registrado correctamente"));
      onSuccess?.();
    },
  });
}
