import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReptilById } from "../api/ReptilApi";
import { toast } from "react-toastify";

export function useDeleteReptil(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReptilById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reptiles"] });
      toast.success("Reptil eliminado correctamente");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error al eliminar el reptil");
    },
  });
}
