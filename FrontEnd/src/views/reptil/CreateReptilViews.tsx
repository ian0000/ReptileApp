import { useMutation } from "@tanstack/react-query";
import type { ReptilFormData } from "../../types";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { createReptil } from "../../api/ReptilApi";
import { useForm } from "react-hook-form";
import ReptilForm from "../../component/reptil/ReptilForm";

export default function CreateReptilViews() {
  const navigate = useNavigate();

  const initialValues: ReptilFormData = {
    name: "",
    birthDate: new Date().toString(),
    description: "",
    genre: 1,
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createReptil,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReptilFormData>({
    defaultValues: initialValues,
  });

  const handleForm = (formData: ReptilFormData) => {
    const payload = {
      ...formData,
      genre: Number(formData.genre),
    };
    mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold
                     text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Volver
        </Link>

        {/* Card */}
        <div
          className="relative bg-white rounded-3xl shadow-xl
                     p-10 overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Nuevo Reptil 🦎</h1>
            <p className="text-gray-500 mt-2 text-lg">
              Registra un nuevo integrante en tu colección
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleForm)} noValidate className="relative space-y-6">
            <ReptilForm register={register} errors={errors} />

            {/* CTA */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 rounded-xl
                         bg-gradient-to-r from-emerald-500 to-sky-500
                         hover:from-emerald-600 hover:to-sky-600
                         disabled:opacity-60 disabled:cursor-not-allowed
                         text-white font-extrabold text-lg
                         tracking-wide shadow-lg
                         transition-all transform hover:-translate-y-0.5"
            >
              {isPending ? "Guardando..." : "Crear Reptil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
