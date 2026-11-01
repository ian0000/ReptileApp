import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReptilById } from "../api/ReptilApi";
import { toast } from "react-toastify";

export function useDeleteReptil(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReptilById,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reptiles"] });
      toast.success(successMessage(data, "Reptil eliminado correctamente"));
      onSuccess?.();
    },
  });
}
