import { Link, useNavigate } from "react-router-dom";
import type { ReptilFormData } from "../../types";
import { useForm } from "react-hook-form";
import ReptilForm from "./ReptilForm";

type EditReptileFormProps = {
  data: ReptilFormData;
  reptilId: string;
};

import { useEffect } from "react";
import { formatDateForInput } from "../../utils/utils";
import { useUpdateReptil } from "../../hooks/useUpdateReptil";

export const EditReptileForm = ({ data, reptilId }: EditReptileFormProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReptilFormData>({
    defaultValues: {
      ...data,
      birthDate: formatDateForInput(data.birthDate) as any,
    },
  });

  useEffect(() => {
    reset({
      ...data,
      birthDate: formatDateForInput(data.birthDate) as any,
    });
  }, [data, reset]);

  const { mutate: updateReptil } = useUpdateReptil(reptilId, () => {
    navigate("/");
  });

  const handleForm = (formData: ReptilFormData) => {
    updateReptil(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Editar Reptil 🦎</h1>

        <nav className="mb-6">
          <Link to="/" className="text-emerald-600 font-bold hover:underline">
            ← Volver a la lista
          </Link>
        </nav>

        <form onSubmit={handleSubmit(handleForm)} noValidate>
          <ReptilForm register={register} errors={errors} />

          <button
            type="submit"
            className="mt-6 bg-gradient-to-r from-emerald-500 to-sky-500
                       hover:from-emerald-600 hover:to-sky-600
                       text-white font-bold py-3 px-6 rounded-xl shadow-lg
                       transition"
          >
            Actualizar Reptil
          </button>
        </form>
      </div>
    </div>
  );
};
