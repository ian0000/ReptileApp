import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReptilId } from "../api/ids";
import type { LogPesajeFormData } from "../types";
import { createLogPesaje } from "../api/LogPesajeApi";
import { toast } from "react-toastify";
import { isZodError } from "../utils/utils";

export function useCreateLogPesaje(reptilId: ReptilId, onsuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formdata: LogPesajeFormData) => createLogPesaje(reptilId, formdata),
    onError: (error: unknown) => {
      console.log(error);
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
      queryClient.invalidateQueries({ queryKey: ["logPesajes", reptilId] });
      toast.success(data);
      onsuccess?.();
    },
  });
}
