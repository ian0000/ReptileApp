import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogComidasId, ReptilId } from "../api/ids";
import { deleteLogComidaById } from "../api/LogComidasApi";
import { toast } from "react-toastify";

export function useDeleteLogComidas(reptilId: ReptilId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logComidaId: LogComidasId) => deleteLogComidaById(reptilId, logComidaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logComidas", reptilId] });
      toast.success("Registro de comida eliminado correctamente");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error al eliminar el registro de comida");
    },
  });
}
