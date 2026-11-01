import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogComidasId, ReptilId } from "../api/ids";
import { deleteLogComidaById } from "../api/LogComidasApi";
import { toast } from "react-toastify";

export function useDeleteLogComidas(
  reptilId: ReptilId,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logComidaId: LogComidasId) =>
      deleteLogComidaById(reptilId, logComidaId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logComidas", reptilId] });
      toast.success(
        successMessage(data, "Registro de comida eliminado correctamente"),
      );
      onSuccess?.();
    },
  });
}
