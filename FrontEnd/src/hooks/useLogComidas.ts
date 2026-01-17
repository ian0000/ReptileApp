import { useQuery } from "@tanstack/react-query";
import type { LogComidasId, ReptilId } from "../api/ids";
import { getLogComidaById } from "../api/LogComidasApi";

export function useLogComida(reptilId: ReptilId, logComidaId: LogComidasId) {
  return useQuery({
    queryKey: ["logComida", reptilId, logComidaId],
    queryFn: () => getLogComidaById(reptilId!, logComidaId!),
    retry: false,
  });
}
