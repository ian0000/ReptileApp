import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { confirmAccount } from "../../api/AuthApi";

export default function ConfirmAccountView() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: confirmAccount,
    onError: (error: Error) => {
      toast.error(error.message ?? "Código inválido");
      setToken("");
    },
    onSuccess: (data: string) => {
      toast.success(data);
      navigate("/auth/login");
    },
  });

  const handleChange = (value: string) => {
    // Solo números
    if (!/^\d*$/.test(value)) return;

    setToken(value);

    // Auto validar cuando tenga 6
    if (value.length === 6 && !isPending) {
      mutate({ token: value });
    }
  };

  return (
    <>
      <form className="space-y-8 p-10 rounded-2xl bg-white mt-10 shadow-lg">
        <label className="block text-center text-xl font-bold text-gray-800">
          Confirma tu cuenta
        </label>

        <p className="text-center text-gray-500 text-sm">
          Ingresa el código de 6 dígitos que enviamos a tu correo
        </p>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={token}
          onChange={(e) => handleChange(e.target.value)}
          disabled={isPending}
          className="
            mx-auto block w-48 text-center text-2xl tracking-widest
            rounded-xl border border-gray-300 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-emerald-500
            transition
          "
          placeholder="••••••"
        />

        {isPending && (
          <p className="text-center text-sm text-gray-500 animate-pulse">Validando código…</p>
        )}
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link to="/auth/request-code" className="text-center text-gray-300 font-normal">
          Solicitar un nuevo código
        </Link>
      </nav>
    </>
  );
}
