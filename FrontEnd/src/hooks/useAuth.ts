import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api/AuthApi";

export const useAuth = () => {
  const { data, isError, isLoading, error, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!localStorage.getItem("AUTH_TOKEN"),
    retry: 1,
    refetchOnWindowFocus: false,
  });
  return { data, isError, isLoading, error, refetch };
};
