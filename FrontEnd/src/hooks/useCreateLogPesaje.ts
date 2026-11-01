import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReptilId } from "../api/ids";
import type { LogPesajeFormData } from "../types";
import { createLogPesaje } from "../api/LogPesajeApi";
import { toast } from "react-toastify";

export function useCreateLogPesaje(reptilId: ReptilId, onsuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formdata: LogPesajeFormData) =>
      createLogPesaje(reptilId, formdata),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logPesajes", reptilId] });
      toast.success(successMessage(data, "Pesaje registrado correctamente"));
      onsuccess?.();
    },
  });
}
