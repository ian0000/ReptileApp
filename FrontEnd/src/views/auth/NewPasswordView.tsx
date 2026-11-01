import { useState } from "react";
import NewPasswordForm from "../../component/auth/NewPasswordForm";
import NewPasswordToken from "../../component/auth/NewPasswordToken";

export default function NewPasswordView() {
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  return (
    <>
      <title>Nueva contraseña — ReptileApp</title>
      <h1>{isValidToken ? "Elige tu contraseña." : "Recupera tu cuenta."}</h1>
      <p className="auth-intro">{isValidToken ? "Código comprobado. Crea una contraseña nueva para volver a tus registros." : "Introduce el código que recibiste por correo. Lo comprobaremos al completarlo."}</p>
      {isValidToken ? <NewPasswordForm token={token} /> : <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} />}
    </>
  );
}
