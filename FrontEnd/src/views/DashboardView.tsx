import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getReptiles } from "../api/ReptilApi";
import { formatDate } from "../utils/utils";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function DashboardView() {
  const navigate = useNavigate();

  const { data: user, isLoading: authLoading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reptiles"],
    queryFn: getReptiles,
  });

  useEffect(() => {
    if (isError) {
      navigate("/404", { replace: true });
    }
  }, [isError, navigate]);
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando rept2il...</p>
      </div>
    );
  }
  if (data && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">Mis Reptiles 🦎</h1>
              <p className="text-gray-500 mt-2 text-lg">Administra y consulta todos tus reptiles</p>
            </div>

            <Link
              to="/reptiles/nuevo"
              className="mt-6 sm:mt-0 inline-flex items-center gap-2
                       bg-gradient-to-r from-emerald-500 to-sky-500
                       hover:from-emerald-600 hover:to-sky-600
                       text-white font-bold
                       px-6 py-3 rounded-xl
                       shadow-lg transition-all
                       transform hover:-translate-y-0.5"
            >
              + Agregar Reptil
            </Link>
          </div>

          {/* Grid */}
          {data.length ? (
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((reptile) => (
                <li
                  key={reptile._id}
                  className="relative bg-white rounded-2xl shadow-lg
                           p-6 hover:shadow-xl transition
                           overflow-hidden group"
                >
                  {/* Glow */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl group-hover:opacity-100 opacity-70 transition" />

                  <div className="relative">
                    <h2 className="text-2xl font-extrabold text-gray-800">{reptile.name}</h2>

                    <p className="text-sm text-gray-500 mt-3">Fecha de nacimiento</p>
                    <p className="text-gray-700 font-semibold">
                      {reptile.birthDate ? formatDate(reptile.birthDate) : "No registrada"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reptile.owner?._id !== user._id && reptile.owner?.name}
                    </p>

                    <Link
                      to={`/reptiles/${reptile._id}`}
                      className="text-emerald-600 font-bold hover:text-emerald-800 transition"
                    >
                      {" "}
                      Ver detalles →{" "}
                    </Link>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link
                        to={`/reptiles/${reptile._id}/notas`}
                        className="text-gray-500 hover:text-emerald-600 transition"
                      >
                        📝 Notas
                      </Link>

                      <Link
                        to={`/reptiles/${reptile._id}/comidas`}
                        className="text-gray-500 hover:text-emerald-600 transition"
                      >
                        🍽️ Comidas
                      </Link>

                      <Link
                        to={`/reptiles/${reptile._id}/pesajes`}
                        className="text-gray-500 hover:text-emerald-600 transition"
                      >
                        ⚖️ Pesajes
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-14 text-center">
              <p className="text-gray-500 text-xl">No tienes reptiles registrados</p>
              <Link
                to="/reptiles/nuevo"
                className="inline-block mt-6 font-bold text-emerald-600 hover:underline"
              >
                Agrega tu primer reptil 🦎
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }
}
