import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
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

        <p className="mb-4">Aquí puedes ver todos tus reptiles registrados.</p>

        <nav className="mb-4">
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            to={"/reptiles/nuevo"}
          >
            Agregar Reptil
          </Link>
        </nav>

        {data.length ? (
          <ul role="list" className="space-y-2">
            {data.map((reptile) => (
              <li key={reptile._id} className="p-4 border rounded">
                <h2 className="text-xl font-semibold">{reptile.name}</h2>
                <p>Fecha Nacimiento: {reptile.birthDate?.toLocaleDateString()} </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes reptiles registrados. ¡Agrega uno para comenzar!</p>
        )}
      </>
    );
  }
}
