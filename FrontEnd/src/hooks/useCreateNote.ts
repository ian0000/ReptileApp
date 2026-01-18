import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReptilId } from "../api/ids";
import { createNote } from "../api/NotesApi";
import { toast } from "react-toastify";
import type { NoteFormData } from "../types";

export function useCreateNote(reptilId: ReptilId, onsuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: NoteFormData) => createNote(reptilId, formData),
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", reptilId] });
      toast.success(data);
      onsuccess?.();
    },
  });
}
