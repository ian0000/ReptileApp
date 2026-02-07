import { useQuery } from "@tanstack/react-query";
import type { LogComidasId, ReptilId } from "../api/ids";
import { getLogComidaById } from "../api/LogComidasApi";
type UseLogComidaOptions = {
  enabled?: boolean;
};
export function useLogComida(
  reptilId: ReptilId,
  logComidaId: LogComidasId,
  options?: UseLogComidaOptions,
) {
  return useQuery({
    queryKey: ["logComida", reptilId, logComidaId],
    queryFn: () => getLogComidaById(reptilId!, logComidaId!),
    enabled: options?.enabled ?? true,
    retry: false,
  });
}
