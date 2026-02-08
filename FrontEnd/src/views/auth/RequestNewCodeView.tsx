import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../component/ErrorMessage";
import type { RequestConfirmationCodeForm } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { RequestConfirmationCode } from "../../api/AuthApi";

export default function RequestNewCodeView() {
  const initialValues: RequestConfirmationCodeForm = {
    email: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: RequestConfirmationCode,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
    },
  });

  const handleRequestCode = (formData: RequestConfirmationCodeForm) => {
    mutate(formData);
  };
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Solicitar código de confirmación</h1>
        <p className="text-gray-500 mt-2">Ingresa tu email y te enviaremos un nuevo código</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleRequestCode)} className="space-y-6" noValidate>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
            {...register("email", {
              required: "El email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-4 px-6 py-3 rounded-xl
                   bg-gradient-to-r from-emerald-500 to-sky-500
                   hover:from-emerald-600 hover:to-sky-600
                   text-white font-bold text-lg
                   shadow-lg transition-all
                   transform hover:-translate-y-0.5"
        >
          Enviar código
        </button>
      </form>

      {/* Links */}
      <nav className="mt-8 flex flex-col gap-3 text-sm text-center">
        <Link to="/auth/login" className="text-gray-500 hover:text-emerald-600 transition">
          ¿Ya tienes cuenta? <span className="font-semibold">Iniciar sesión</span>
        </Link>

        <Link
          to="/auth/forgot-password"
          className="text-gray-500 hover:text-emerald-600 transition"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </nav>
    </>
  );
}
