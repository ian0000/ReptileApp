import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogPesajeId, ReptilId } from "../api/ids";
import type { LogPesajeFormData } from "../types";
import { updateLogPesajeData } from "../api/LogPesajeApi";
import { toast } from "react-toastify";

export function useUpdateLogPesaje(
  reptilId: ReptilId,
  logPesajeId: LogPesajeId,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: LogPesajeFormData) =>
      updateLogPesajeData({ reptilId, logPesajeId, formData }),
    onSuccess: (message, formData) => {
      queryClient.setQueryData(["logPesaje", reptilId, logPesajeId], (oldData: any) =>
        oldData ? { ...oldData, ...formData } : formData,
      );
      queryClient.invalidateQueries({ queryKey: ["logPesajes", reptilId] });
      toast.success(message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error al actualizar el registro de pesaje");
    },
  });
}
