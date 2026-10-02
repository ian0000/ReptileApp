import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LogComidasId, ReptilId } from "../api/ids";
import type { LogComidasFormData } from "../types";
import { updateLogComidasData } from "../api/LogComidasApi";
import { toast } from "react-toastify";
import { isZodError } from "../utils/utils";

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
      queryClient.setQueryData(["logComida", reptilId, logComidaId], (oldData: unknown) =>
        oldData && typeof oldData === "object" ? { ...oldData, ...formData } : formData,
      );
      queryClient.invalidateQueries({ queryKey: ["logComidas", reptilId] });
      toast.success(message);
      onSuccess?.();
    },
    onError: (error: unknown) => {
      // 1️⃣ ZodError real (como el que tienes)
      if (isZodError(error)) {
        error.issues.forEach((issue) => {
          toast.error(`${issue.path.join(".")}: ${issue.message}`);
        });
        return;
      }

      // 2️⃣ Axios / Fetch con ZodError serializado
      const data =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: unknown } }).response?.data
          : undefined;

      if (isZodError(data)) {
        data.issues.forEach((issue) => {
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
  });
}
