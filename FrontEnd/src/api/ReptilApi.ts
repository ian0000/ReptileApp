import { isAxiosError } from "axios";
import api from "../lib/axios";
import { dashboardReptilSchema, reptilSchema, type Reptil, type ReptilFormData } from "../types";

const genreToNumber = (genre: ReptilFormData["genre"]) => {
  if (genre === "macho") return 1;
  if (genre === "hembra") return 2;
  return 3;
};

export function formatDateForInput(date?: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function createReptil(formData: ReptilFormData) {
  try {
    formData.genre = genreToNumber(formData.genre) as any;
    const { data } = await api.post("/reptiles/create-reptil", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.log(error.response.data);
      throw new Error(error.response?.data.error || "Error creating reptile");
    }
  }
}

export async function getReptiles() {
  try {
    const { data } = await api.get("/reptiles");
    const response = dashboardReptilSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error || "Error fetching reptiles");
    }
  }
}

export async function getReptilById(reptilId: Reptil["_id"]) {
  try {
    const { data } = await api(`/reptiles/${reptilId}`);
    const response = reptilSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error || "Error fetching reptile");
    }
  }
}

type ReptilAPIType = {
  formData: ReptilFormData;
  reptilId: Reptil["_id"];
};

export async function updateReptileData({ formData, reptilId }: ReptilAPIType) {
  try {
    formData.genre = genreToNumber(formData.genre) as any;
    console.log(formData);
    const { data } = await api.patch(`/reptiles/update-reptil/${reptilId}`, formData);
    console.log(data);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error || "Error updating reptile");
    }
  }
}

export async function deleteReptilById(reptilId: Reptil["_id"]) {
  try {
    const { data } = await api.delete(`/reptiles/delete-reptil/${reptilId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error || "Error deleting reptile");
    }
  }
}
