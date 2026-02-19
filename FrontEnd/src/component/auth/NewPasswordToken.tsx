import { Link } from "react-router-dom";
import type { ConfirmToken } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { validateToken } from "../../api/AuthApi";

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: validateToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      setIsValidToken(true);
    },
  });

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
    console.log(token);

    if (token.length === 6) {
      handleComplete;
    }
  };

  const handleComplete = (token: ConfirmToken["token"]) => {
    mutate({ token });
  };
  return (
    <>
      <form className="space-y-8 p-10 rounded-2xl bg-white mt-10 shadow-lg">
        <label className="block text-center text-xl font-bold text-gray-800">
          Código de 6 dígitos
        </label>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={token}
          disabled={isPending}
          onChange={(e) => handleChange(e.target.value)}
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
        <Link to="/auth/forgot-password" className="text-center text-gray-300 font-normal">
          Solicitar un nuevo código
        </Link>
      </nav>
    </>
  );
}
