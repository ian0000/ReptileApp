import { isAxiosError } from "axios";
import api from "../lib/axios";
import { reptilFormSchema, type ReptilFormData } from "../types";
import type { components } from "./types";
import { schemas } from "./client";
import type { ReptilId } from "./ids";

type Reptil = components["schemas"]["Reptil"];

export async function createReptil(formData: ReptilFormData) {
  try {
    // Validación UX (opcional pero recomendable)
    const payload = reptilFormSchema.parse(formData);

    const { data } = await api.post("/reptiles/create-reptil", payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error creating reptile");
    }
    throw error;
  }
}

export async function getReptiles(): Promise<Pick<Reptil, "_id" | "name" | "birthDate">[]> {
  try {
    const { data } = await api.get("/reptiles");

    // Validación API (opcional)
    return schemas.Reptil.pick({ _id: true, name: true, birthDate: true }).array().parse(data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching reptiles");
    }
    throw error;
  }
}

export async function getReptilById(reptilId: ReptilId): Promise<Reptil> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}`);
    return schemas.Reptil.parse(data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching reptile");
    }
    throw error;
  }
}

type UpdateReptilArgs = {
  formData: ReptilFormData;
  reptilId: ReptilId;
};

export async function updateReptileData({ formData, reptilId }: UpdateReptilArgs) {
  try {
    console.log("Updating reptile with ID:", reptilId, "and data:", formData);
    const payload = reptilFormSchema.parse(formData);

    const { data } = await api.patch(`/reptiles/update-reptil/${reptilId}`, payload);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error updating reptile");
    }
    throw error;
  }
}

export async function deleteReptilById(reptilId: ReptilId) {
  try {
    const { data } = await api.delete(`/reptiles/delete-reptil/${reptilId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error || "Error deleting reptile");
    }
  }
}
