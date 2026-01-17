import { isAxiosError } from "axios";
import api from "../lib/axios";
import { logComidasFormSchema, type LogComidasFormData } from "../types";
import type { LogComidasId, ReptilId } from "./ids";
import type { components } from "./types";
import { schemas } from "./client";

type LogComidas = components["schemas"]["LogComidas"];

export async function createLogComidas(reptilId: ReptilId, formData: LogComidasFormData) {
  try {
    const payload = logComidasFormSchema.parse(formData);
    const { data } = await api.post(`/reptiles/${reptilId}/logComidas`, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error creating food log");
    }
    throw error;
  }
}

export async function getLogComidas(
  reptilId: ReptilId,
): Promise<Pick<LogComidas, "_id" | "tipoAlimento" | "cantidad" | "createdAt">[]> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}/logComidas`);
    return schemas.LogComidas.pick({
      _id: true,
      tipoAlimento: true,
      cantidad: true,
      createdAt: true,
    })
      .array()
      .parse(data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching food logs");
    }
    throw error;
  }
}

export async function getLogComidaById(
  reptilId: ReptilId,
  logComidaId: LogComidasId,
): Promise<LogComidas> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}/logComidas/${logComidaId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching food log");
    }
    throw error;
  }
}

type UpdateLogComidasArgs = {
  reptilId: ReptilId;
  formData: LogComidasFormData;
  logComidaId: LogComidasId;
};
export async function updateLogComidasData({
  reptilId,
  logComidaId,
  formData,
}: UpdateLogComidasArgs) {
  try {
    const payload = logComidasFormSchema.parse(formData);
    const { data } = await api.patch(`/reptiles/${reptilId}/logComidas/${logComidaId}`, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error updating food log");
    }
    throw error;
  }
}
export async function deleteLogComidaById(reptilId: ReptilId, logComidaId: LogComidasId) {
  try {
    const { data } = await api.delete(`/reptiles/${reptilId}/logComidas/${logComidaId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error deleting food log");
    }
    throw error;
  }
}
