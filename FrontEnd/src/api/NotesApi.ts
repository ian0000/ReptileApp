import { isAxiosError } from "axios";
import api from "../lib/axios";
import { noteFormSchema, type NoteFormData } from "../types";
import type { components } from "./types";
import { schemas } from "./client";
import type { NoteId, ReptilId } from "./ids";

type Note = components["schemas"]["Note"];

export async function createNote(reptilId: ReptilId, formData: NoteFormData) {
  try {
    const payload = noteFormSchema.parse(formData);

    const { data } = await api.post(`/reptiles/${reptilId}/notes`, payload);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error creating note");
    }
    throw error;
  }
}

export async function getNotes(
  reptilId: ReptilId,
): Promise<Pick<Note, "_id" | "name" | "type" | "createdAt">[]> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}/notes`);
    return schemas.Note.pick({ _id: true, name: true, type: true, createdAt: true })
      .array()
      .parse(data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching notes");
    }
    throw error;
  }
}

export async function getNoteById(reptilId: ReptilId, noteId: NoteId): Promise<Note> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}/notes/${noteId}`);
    return schemas.Note.parse(data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching note");
    }
    throw error;
  }
}
type UpdateNoteArgs = {
  reptilId: ReptilId;
  formData: NoteFormData;
  noteId: NoteId;
};
export async function updateNoteData({ reptilId, noteId, formData }: UpdateNoteArgs) {
  try {
    const payload = noteFormSchema.parse(formData);

    const { data } = await api.patch(`/reptiles/${reptilId}/notes/${noteId}`, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error updating note");
    }
    throw error;
  }
}
export async function deleteNoteById(reptilId: ReptilId, noteId: NoteId) {
  try {
    const { data } = await api.delete(`/reptiles/${reptilId}/notes/${noteId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error deleting note");
    }
    throw error;
  }
}
