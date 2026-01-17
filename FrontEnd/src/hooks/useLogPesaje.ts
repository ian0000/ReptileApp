import { useQuery } from "@tanstack/react-query";
import type { LogPesajeId, ReptilId } from "../api/ids";
import { getLogPesajeById } from "../api/LogPesajeApi";

export function useLogPesaje(reptilId: ReptilId, logPesajeId: LogPesajeId) {
  return useQuery({
    queryKey: ["logPesaje", logPesajeId],
    queryFn: () => getLogPesajeById(reptilId!, logPesajeId!),
    retry: false,
  });
}
