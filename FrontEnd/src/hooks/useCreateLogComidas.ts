import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLogComidas } from "../api/LogComidasApi";
import type { LogComidasFormData } from "../types";
import type { ReptilId } from "../api/ids";
import { toast } from "react-toastify";
import { isZodError } from "../utils/utils";

export function useCreateLogComidas(reptilId: ReptilId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: LogComidasFormData) => createLogComidas(reptilId, formData),
    onError: (error: unknown) => {
      // 1️⃣ ZodError real (como el que tienes)
      if (isZodError(error)) {
        error.issues.forEach((issue) => {
          toast.error(`${issue.path.join(".")}: ${issue.message}`);
        });
        return;
      }

      // 2️⃣ Axios / Fetch con ZodError serializado
      const data = (error as any)?.response?.data;

      if (isZodError(data)) {
        data.issues.forEach((issue: any) => {
          toast.error(`${issue.path.join(".")}: ${issue.message}`);
        });
        return;
      }

      // 3️⃣ Error estándar
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }

      // 4️⃣ Fallback
      toast.error("Error inesperado al procesar la solicitud");
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logComidas", reptilId] });
      toast.success(data);
      onSuccess?.();
    },
  });
}
