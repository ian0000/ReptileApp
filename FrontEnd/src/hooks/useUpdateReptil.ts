import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReptileData } from "../api/ReptilApi";
import type { ReptilId } from "../api/ids";
import { toast } from "react-toastify";
import type { ReptilFormData } from "../types";

export function useUpdateReptil(reptilId: ReptilId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: ReptilFormData) =>
      updateReptileData({ reptilId, formData }),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["reptile", reptilId] });

      queryClient.invalidateQueries({ queryKey: ["reptiles"] });

      toast.success(
        successMessage(message, "Reptil actualizado correctamente"),
      );
      onSuccess?.();
    },
  });
}
