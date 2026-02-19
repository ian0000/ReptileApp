import { useState } from "react";
import type { ConfirmToken } from "../../types";
import NewPasswordForm from "../../component/auth/NewPasswordForm";
import NewPasswordToken from "../../component/auth/NewPasswordToken";

export default function NewPasswordView() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <div className="text-center">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-white">Restablecer Contraseña 🔐</h1>

      <p className="text-lg lg:text-xl font-light text-gray-300 mt-4 max-w-md mx-auto leading-relaxed">
        Ingresa el código que recibiste{" "}
        <span className="text-emerald-400 font-semibold">por correo electrónico</span>
      </p>

      <div className="mt-10">
        {!isValidToken ? (
          <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />
        ) : (
          <NewPasswordForm token={token} />
        )}
      </div>
    </div>
  );
}
