import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReptileData } from "../api/ReptilApi";
import type { ReptilId } from "../api/ids";
import { toast } from "react-toastify";
import type { ReptilFormData } from "../types";

export function useUpdateReptil(reptilId: ReptilId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: ReptilFormData) => updateReptileData({ reptilId, formData }),
    onSuccess: (message, formData) => {
      queryClient.setQueryData(["reptil", reptilId], (oldData: any) =>
        oldData ? { ...oldData, ...formData } : formData,
      );

      queryClient.invalidateQueries({ queryKey: ["reptiles"] });

      toast.success(message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error al actualizar el reptil");
    },
  });
}
