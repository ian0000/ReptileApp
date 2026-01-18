import { isAxiosError } from "axios";
import api from "../lib/axios";
import { logPesajeFormSchema, type LogPesajeFormData } from "../types";
import type { LogPesajeId, ReptilId } from "./ids";
import type { components } from "./types";
import { schemas } from "./client";

type LogPesaje = components["schemas"]["LogPesaje"];

export async function createLogPesaje(reptilId: ReptilId, formData: LogPesajeFormData) {
  try {
    const payload = logPesajeFormSchema.parse(formData);

    const { data } = await api.post(`/reptiles/${reptilId}/logPesaje`, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error creating weight log");
    }
    throw error;
  }
}

export async function getLogPesajes(
  reptilId: ReptilId,
): Promise<Pick<LogPesaje, "_id" | "peso" | "unidad" | "createdAt">[]> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}/logPesaje`);
    return schemas.LogPesaje.pick({ _id: true, peso: true, unidad: true, createdAt: true })
      .array()
      .parse(data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching weight logs");
    }
    throw error;
  }
}
export async function getLogPesajeById(
  reptilId: ReptilId,
  logPesajeId: LogPesajeId,
): Promise<LogPesaje> {
  try {
    const { data } = await api.get(`/reptiles/${reptilId}/logPesaje/${logPesajeId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error fetching weight log");
    }
    throw error;
  }
}

type UpdateLogPesajeArgs = {
  reptilId: ReptilId;
  formData: LogPesajeFormData;
  logPesajeId: LogPesajeId;
};
export async function updateLogPesajeData({
  reptilId,
  logPesajeId,
  formData,
}: UpdateLogPesajeArgs) {
  try {
    const payload = logPesajeFormSchema.parse(formData);
    const { data } = await api.patch(`/reptiles/${reptilId}/logPesaje/${logPesajeId}`, payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error updating weight log");
    }
    throw error;
  }
}
export async function deleteLogPesajeById(reptilId: ReptilId, logPesajeId: LogPesajeId) {
  try {
    const { data } = await api.delete(`/reptiles/${reptilId}/logPesaje/${logPesajeId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error deleting weight log");
    }
    throw error;
  }
}
