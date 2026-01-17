import { useQuery } from "@tanstack/react-query";
import type { NoteId, ReptilId } from "../api/ids";
import { getNoteById } from "../api/NotesApi";

export function useNote(reptilId: ReptilId, noteId: NoteId) {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(reptilId!, noteId!),
    retry: false,
  });
}
