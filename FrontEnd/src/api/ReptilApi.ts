import { isAxiosError } from "axios";
import api from "../lib/axios";
import { dashboardReptilSchema, type ReptilFormData } from "../types";

export async function createReptil(formData: ReptilFormData) {
  try {
    const { data } = await api.post("/reptiles", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
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
