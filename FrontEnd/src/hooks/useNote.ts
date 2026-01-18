import { useQuery } from "@tanstack/react-query";
import type { NoteId, ReptilId } from "../api/ids";
import { getNoteById } from "../api/NotesApi";

type UseNoteOptions = {
  enabled?: boolean;
};
export function useNote(reptilId: ReptilId, noteId: NoteId, options?: UseNoteOptions) {
  return useQuery({
    queryKey: ["note", reptilId, noteId],
    queryFn: () => getNoteById(reptilId!, noteId!),
    enabled: options?.enabled ?? true,
    retry: false,
  });
}
