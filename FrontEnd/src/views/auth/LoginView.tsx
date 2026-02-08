import { useForm } from "react-hook-form";
import ErrorMessage from "../../component/ErrorMessage";
import type { UserLoginForm } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authenticateUser } from "../../api/AuthApi";

export default function LoginView() {
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Iniciando sesion...");
      navigate("/");
    },
  });
  const handleLogin = (formData: UserLoginForm) => {
    mutate(formData);
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Iniciar sesión</h1>
        <p className="text-gray-500 mt-2">Accede a tu cuenta para continuar</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6" noValidate>
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
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
              required: "El email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200
                     px-4 py-2.5 text-gray-800
                     focus:outline-none focus:ring-2
                     focus:ring-emerald-500/30
                     focus:border-emerald-500
                     transition"
            {...register("password", {
              required: "El password es obligatorio",
            })}
          />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
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
          Iniciar sesión
        </button>
      </form>

      {/* Links */}
      <nav className="mt-8 flex flex-col gap-3 text-sm text-center">
        <Link to="/auth/register" className="text-gray-500 hover:text-emerald-600 transition">
          ¿No tienes una cuenta? <span className="font-semibold">Crear cuenta</span>
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
