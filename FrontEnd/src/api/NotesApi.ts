import { isAxiosError } from "axios";
import api from "../lib/axios";
import { noteFormSchema, type NoteFormData } from "../types";
import { schemas } from "./client";
import type { Note, NoteId, ReptilId } from "./ids";

export async function createNote(reptilId: ReptilId, formData: NoteFormData) {
  try {
    const payload = noteFormSchema.parse({ ...formData, reptil: reptilId });

    const { data } = await api.post(`/reptiles/${reptilId}/notes`, payload);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error creating note");
    }
    throw error;
  }
}
export type NoteListItem = Pick<
  Note,
  | "_id"
  | "name"
  | "type"
  | "description"
  | "createdAt"
  | "tags"
  | "temp"
  | "humidity"
  | "weight"
  | "createdBy"
>;

export async function getNotes(reptilId: ReptilId): Promise<NoteListItem[]> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}/notes`);
    return schemas.Note.pick({
      _id: true,
      name: true,
      type: true,
      description: true,
      createdAt: true,
      tags: true,
      temp: true,
      humidity: true,
      weight: true,
      createdBy: true,
    })
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
    const response = await api.get(`/reptiles/${reptilId}/notes/${noteId}`);
    return response.data;
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
