import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "../../api/AuthApi";
import { FormField, FormNotice, SubmitButton } from "../../design-system/forms";

export default function ConfirmAccountView() {
  const [token, setToken] = useState("");
  const inFlight = useRef(false);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: confirmAccount,
    onSuccess: (data) =>
      navigate("/auth/login", {
        replace: true,
        state: {
          notice: data || "Cuenta confirmada. Ya puedes iniciar sesión.",
        },
      }),
    onSettled: () => {
      inFlight.current = false;
    },
  });
  function submitCode(value: string) {
    if (value.length !== 6 || inFlight.current || mutation.isPending) return;
    inFlight.current = true;
    mutation.mutate({ token: value });
  }
  return (
    <>
      <title>Confirmar cuenta — ReptileApp</title>
      <h1>Confirma tu cuenta.</h1>
      <p className="auth-intro">
        Introduce el código de 6 dígitos enviado a tu correo. Lo comprobaremos
        al completarlo.
      </p>
      <form
        className="ra-form"
        onSubmit={(event) => {
          event.preventDefault();
          submitCode(token);
        }}
      >
        {mutation.isError && (
          <div id="confirm-token-status">
            <FormNotice tone="error">{mutation.error.message}</FormNotice>
          </div>
        )}
        <FormField
          id="confirm-token"
          label="Código de confirmación"
          hint="6 dígitos. También puedes pegar el código completo."
        >
          <input
            id="confirm-token"
            className="ra-input auth-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={token}
            disabled={mutation.isPending}
            aria-describedby={`confirm-token-hint${mutation.isError ? " confirm-token-status" : ""}`}
            aria-invalid={mutation.isError}
            onChange={(event) => {
              const value = event.target.value;
              if (!/^\d*$/.test(value)) return;
              setToken(value);
              if (value.length === 6) submitCode(value);
            }}
          />
        </FormField>
        <SubmitButton
          pending={mutation.isPending}
          pendingLabel="Comprobando código…"
          disabled={token.length !== 6}
        >
          Confirmar cuenta
        </SubmitButton>
      </form>
      <nav className="ra-form-nav" aria-label="Ayuda con la confirmación">
        <Link to="/auth/request-code">No recibí el código o ha vencido</Link>
        <Link to="/auth/login">Volver a iniciar sesión</Link>
      </nav>
    </>
  );
}
