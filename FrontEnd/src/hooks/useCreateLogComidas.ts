import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLogComidas } from "../api/LogComidasApi";
import type { LogComidasFormData } from "../types";
import type { ReptilId } from "../api/ids";
import { toast } from "react-toastify";

export function useCreateLogComidas(
  reptilId: ReptilId,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: LogComidasFormData) =>
      createLogComidas(reptilId, formData),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logComidas", reptilId] });
      toast.success(successMessage(data, "Comida registrada correctamente"));
      onSuccess?.();
    },
  });
}
