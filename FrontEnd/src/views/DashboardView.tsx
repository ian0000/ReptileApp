import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { getReptiles } from "../api/ReptilApi";

export default function DashboardView() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reptiles"],
    queryFn: getReptiles,
  });
  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to={"/404"} />;
  if (data) {
    return (
      <>
        <h1 className="text-2xl font-bold mb-4">Mis Reptiles</h1>

        {data.length ? (
          <ul role="list" className="space-y-2">
            {data.map((reptile) => (
              <li key={reptile._id}>{reptile.name}</li>
            ))}
          </ul>
        ) : (
          <p>No tienes reptiles registrados. ¡Agrega uno para comenzar!</p>
        )}
      </>
    );
  }
}
