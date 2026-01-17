import { useMutation } from "@tanstack/react-query";
import { createReptil } from "../api/ReptilApi";
import { toast } from "react-toastify";

export function useCreateReptil(onSuccess?: () => void) {
  return useMutation({
    mutationFn: createReptil,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      onSuccess?.();
    },
  });
}
