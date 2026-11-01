import { successMessage } from "../utils/presentation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNoteById } from "../api/NotesApi";
import type { NoteId, ReptilId } from "../api/ids";
import { toast } from "react-toastify";

export function useDeleteNote(reptilId: ReptilId, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: NoteId) => deleteNoteById(reptilId, noteId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", reptilId] });
      toast.success(successMessage(data, "Nota eliminada correctamente"));
      onSuccess?.();
    },
  });
}
