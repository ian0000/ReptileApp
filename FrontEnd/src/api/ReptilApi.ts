import { isAxiosError } from "axios";
import api from "../lib/axios";
import { dashboardReptilSchema, reptilSchema, type Reptil, type ReptilFormData } from "../types";

export async function createReptil(formData: ReptilFormData) {
  try {
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
    console.log(response);
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
    console.log(data);
    const response = reptilSchema.safeParse(data);
    console.log(response);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error || "Error fetching reptile");
    }
  }
}
