import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { confirmAccount } from "../../api/AuthApi";

export default function ConfirmAccountView() {
  const [token, setToken] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error: any) => {
      toast.error(error.message ?? "Código inválido");
      setToken(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/auth/login");
    },
  });

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);

    // mover foco
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // auto submit
    if (newToken.every((d) => d !== "")) {
      mutate({ token: newToken.join("") });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Confirma tu cuenta</h1>
        <p className="text-gray-500 mt-2">Ingresa el código de 6 dígitos que enviamos a tu email</p>
      </div>

      {/* OTP */}
      <div className="flex flex-col items-center gap-4">
        <label className="block text-sm font-semibold text-gray-700">Código de verificación</label>

        <div className="flex gap-3">
          {token.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-xl font-bold
                         rounded-xl border border-gray-200
                         focus:outline-none focus:ring-2
                         focus:ring-emerald-500/40
                         focus:border-emerald-500
                         transition disabled:opacity-50"
            />
          ))}
        </div>
      </div>

      {/* Links */}
      <nav className="mt-8 text-center text-sm">
        <Link
          to="/auth/request-code"
          className="text-gray-500 hover:text-emerald-600 transition font-semibold"
        >
          Solicitar un nuevo código
        </Link>
      </nav>
    </>
  );
}
