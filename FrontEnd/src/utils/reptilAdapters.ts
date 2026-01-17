import type { components } from "../api/types";
import type { ReptilFormData } from "../types";

type ReptilApi = components["schemas"]["Reptil"];

export function reptilApiToForm(reptil: ReptilApi): ReptilFormData {
  return {
    name: reptil.name,
    birthDate: reptil.birthDate ? reptil.birthDate : "",
    description: reptil.description,
    genre: reptil.genre, //=== 1 ? "macho" : reptil.genre === 2 ? "hembra" : "indefinido",
  };
}
