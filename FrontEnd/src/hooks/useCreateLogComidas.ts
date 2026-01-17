import { useMutation } from "@tanstack/react-query";
import { createLogComidas } from "../api/LogComidasApi";
import type { LogComidasFormData } from "../types";
import type { ReptilId } from "../api/ids";
import { toast } from "react-toastify";

export function useCreateLogComidas(reptilId: ReptilId, onSuccess?: () => void) {
  return useMutation({
    mutationFn: (formData: LogComidasFormData) => createLogComidas(reptilId, formData),
    onError: (error: Error) => {
      toast.error(error.message);
    },

    onSuccess: (data) => {
      toast.success(data);
      onSuccess?.();
    },
  });
}
