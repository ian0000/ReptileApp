import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updatePasswordWithToken } from "../../api/AuthApi";

type NewPasswordFormProps = {
  token: ConfirmToken["token"];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate("/auth/login");
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = {
      formData,
      token,
    };

    mutate(data);
  };

  const password = watch("password");

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-8 p-10 rounded-2xl bg-white mt-10 shadow-lg"
        noValidate
      >
        {/* Password */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-700">Nueva contraseña</label>

          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            className="
            w-full rounded-xl border border-gray-200
            px-4 py-3 text-gray-800
            focus:outline-none focus:ring-2
            focus:ring-emerald-500/40
            focus:border-emerald-500
            transition
          "
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "Debe tener mínimo 8 caracteres",
              },
            })}
          />

          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-700">Confirmar contraseña</label>

          <input
            type="password"
            placeholder="Repite tu contraseña"
            className="
            w-full rounded-xl border border-gray-200
            px-4 py-3 text-gray-800
            focus:outline-none focus:ring-2
            focus:ring-emerald-500/40
            focus:border-emerald-500
            transition
          "
            {...register("password_confirmation", {
              required: "Debes repetir el Password",
              validate: (value) => value === password || "Los Passwords no coinciden",
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="
          w-full py-3 rounded-xl
          bg-gradient-to-r from-emerald-500 to-sky-500
          hover:from-emerald-600 hover:to-sky-600
          text-white font-bold text-lg
          shadow-md transition
        "
        >
          Establecer contraseña
        </button>
      </form>
    </>
  );
}
