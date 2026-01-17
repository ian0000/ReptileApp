import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogComidasId, ReptilId } from "../api/ids";
import type { LogComidasFormData } from "../types";
import { updateLogComidasData } from "../api/LogComidasApi";
import { toast } from "react-toastify";

export function useUpdateLogComidas(
  reptilId: ReptilId,
  logComidaId: LogComidasId,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: LogComidasFormData) =>
      updateLogComidasData({ reptilId, logComidaId, formData }),
    onSuccess: (message, formData) => {
      queryClient.setQueryData(["logComida", reptilId, logComidaId], (oldData: any) =>
        oldData ? { ...oldData, ...formData } : formData,
      );
      queryClient.invalidateQueries({ queryKey: ["logComidas", reptilId] });
      toast.success(message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error al actualizar el registro de comida");
    },
  });
}
