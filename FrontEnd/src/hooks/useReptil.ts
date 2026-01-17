import { useQuery } from "@tanstack/react-query";
import type { ReptilId } from "../api/ids";
import { getReptilById } from "../api/ReptilApi";

export function useReptil(reptilId: ReptilId) {
  return useQuery({
    queryKey: ["reptile", reptilId],
    queryFn: () => getReptilById(reptilId!),
    retry: false,
  });
}
