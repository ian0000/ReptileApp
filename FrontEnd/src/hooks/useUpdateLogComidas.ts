import { successMessage } from "../utils/presentation";
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
      queryClient.setQueryData(
        ["logComida", reptilId, logComidaId],
        (oldData: unknown) =>
          oldData && typeof oldData === "object"
            ? { ...oldData, ...formData }
            : formData,
      );
      queryClient.invalidateQueries({ queryKey: ["logComidas", reptilId] });
      toast.success(
        successMessage(message, "Comida actualizada correctamente"),
      );
      onSuccess?.();
    },
  });
}
