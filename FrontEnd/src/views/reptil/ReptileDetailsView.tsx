import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { deleteReptilById, getReptilById } from "../../api/ReptilApi";
import { formatDateSafe } from "../DashboardView";
import { toast } from "react-toastify";

export default function ReptilDetailsView() {
  const navigate = useNavigate();
  const { id: reptilId } = useParams();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["reptile", reptilId],
    queryFn: () => getReptilById(reptilId!),
    retry: false,
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteReptilById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reptiles"] });
      queryClient.invalidateQueries({ queryKey: ["reptile"] });
      toast.success("Reptil eliminado correctamente");
      navigate("/");
    },
    onError: () => {
      toast.error("Error al eliminar el reptil");
    },
  });
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando reptil...</p>
      </div>
    );
  }

  if (isError || !data) {
    navigate("/404", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">Detalles del Reptil 🦎</h1>
            <p className="text-gray-500 mt-2 text-lg">Información completa del reptil</p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 sm:mt-0 inline-flex items-center gap-2
                       bg-gray-100 hover:bg-gray-200
                       text-gray-700 font-bold
                       px-6 py-3 rounded-xl
                       transition"
          >
            ← Volver
          </button>
        </div>

        {/* Card */}
        <div
          className="relative bg-white rounded-2xl shadow-lg
                     p-8 hover:shadow-xl transition
                     overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl" />

          <div className="relative space-y-8">
            {/* Name */}
            <div className="border-b pb-4">
              <h2 className="text-4xl font-extrabold text-gray-800">{data.name}</h2>
              <p className="text-sm text-gray-400 mt-1">ID: {data._id}</p>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">
                  {data.description || "No hay descripción registrada."}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-5">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Género</span>
                  <span className="font-bold text-gray-800 capitalize">{data.genre}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Fecha de nacimiento</span>
                  <span className="font-bold text-gray-800">
                    {data.birthDate ? formatDateSafe(data.birthDate) : "No registrada"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t">
              <Link
                to={`/reptiles/${data._id}/editar`}
                className="inline-flex items-center gap-2
                           bg-gradient-to-r from-emerald-500 to-sky-500
                           hover:from-emerald-600 hover:to-sky-600
                           text-white font-bold
                           px-6 py-3 rounded-xl
                           shadow-lg transition-all
                           transform hover:-translate-y-0.5"
              >
                Editar Reptil
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (
                    !window.confirm(
                      "¿Estás seguro de eliminar este reptil? Esta acción no se puede deshacer."
                    )
                  ) {
                    return;
                  }

                  deleteMutation.mutate(data._id);
                }}
                className="ml-4 inline-flex items-center gap-2
             bg-gradient-to-r from-red-500 to-red-600
             hover:from-red-600 hover:to-red-700
             text-white font-bold
             px-6 py-3 rounded-xl
             shadow-lg transition-all
             transform hover:-translate-y-0.5"
              >
                Eliminar Reptil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
