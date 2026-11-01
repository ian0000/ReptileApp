import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogPesajeId, ReptilId } from "../api/ids";
import { deleteLogPesajeById } from "../api/LogPesajeApi";
import { toast } from "react-toastify";

export function useDeleteLogPesaje(reptilId: ReptilId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logPesajeId: LogPesajeId) =>
      deleteLogPesajeById(reptilId, logPesajeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logPesajes", reptilId] });
      toast.success(
        successMessage(data, "Registro de pesaje eliminado correctamente"),
      );
      onSuccess?.();
    },
  });
}
