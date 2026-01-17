import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NoteId, ReptilId } from "../api/ids";
import { updateNoteData } from "../api/NotesApi";
import type { NoteFormData } from "../types";
import { toast } from "react-toastify";

export function useUpdateNote(reptilId: ReptilId, noteId: NoteId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: NoteFormData) => updateNoteData({ reptilId, noteId, formData }),
    onSuccess: (message, formData) => {
      queryClient.setQueryData(["note", reptilId, noteId], (oldData: any) =>
        oldData ? { ...oldData, ...formData } : formData,
      );
      queryClient.invalidateQueries({ queryKey: ["notes", reptilId] });
      toast.success(message);
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error al actualizar la nota");
    },
  });
}
