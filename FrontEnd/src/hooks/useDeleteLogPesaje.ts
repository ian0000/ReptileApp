import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogPesajeId, ReptilId } from "../api/ids";
import { deleteLogPesajeById } from "../api/LogPesajeApi";
import { toast } from "react-toastify";

export function useDeleteLogPesaje(reptilId: ReptilId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (logPesajeId: LogPesajeId) => deleteLogPesajeById(reptilId, logPesajeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logPesajes", reptilId] });
      toast.success("Registro de pesaje eliminado correctamente");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error al eliminar el registro de pesaje");
    },
  });
}
