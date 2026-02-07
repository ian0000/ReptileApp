import { useQuery } from "@tanstack/react-query";
import type { LogPesajeId, ReptilId } from "../api/ids";
import { getLogPesajeById } from "../api/LogPesajeApi";

type UseLogPesajeOptions = {
  enabled?: boolean;
};

export function useLogPesaje(
  reptilId: ReptilId,
  logPesajeId: LogPesajeId,
  options?: UseLogPesajeOptions,
) {
  return useQuery({
    queryKey: ["logPesaje", logPesajeId],
    queryFn: () => getLogPesajeById(reptilId!, logPesajeId!),
    enabled: options?.enabled ?? true,
    retry: false,
  });
}
