import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReptilId } from "../api/ids";
import type { LogPesajeFormData } from "../types";
import { createLogPesaje } from "../api/LogPesajeApi";
import { toast } from "react-toastify";

export function useCreateLogPesaje(reptilId: ReptilId, onsuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formdata: LogPesajeFormData) => createLogPesaje(reptilId, formdata),
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logPesajes", reptilId] });
      toast.success(data);
      onsuccess?.();
    },
  });
}
