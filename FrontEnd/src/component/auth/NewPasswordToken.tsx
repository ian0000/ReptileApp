import { useRef, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { validateToken } from "../../api/AuthApi";
import { FormField, FormNotice, SubmitButton } from "../../design-system/forms";

type Props = { token: string; setToken: Dispatch<SetStateAction<string>>; setIsValidToken: Dispatch<SetStateAction<boolean>> };
export default function NewPasswordToken({ token, setToken, setIsValidToken }: Props) {
  const inFlight = useRef(false);
  const mutation = useMutation({ mutationFn: validateToken, onSuccess: () => setIsValidToken(true), onSettled: () => { inFlight.current = false; } });
  function submitCode(value: string) {
    if (value.length !== 6 || inFlight.current || mutation.isPending) return;
    inFlight.current = true;
    mutation.mutate({ token: value });
  }
  return (
    <>
      <form className="ra-form" onSubmit={(event) => { event.preventDefault(); submitCode(token); }}>
        {mutation.isError && <div id="reset-token-status"><FormNotice tone="error">{mutation.error.message}</FormNotice></div>}
        <FormField id="reset-token" label="Código de recuperación" hint="6 dígitos. También puedes pegar el código completo.">
          <input id="reset-token" className="ra-input auth-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={token} disabled={mutation.isPending} aria-invalid={mutation.isError} aria-describedby={`reset-token-hint${mutation.isError ? " reset-token-status" : ""}`} onChange={(event) => { const value = event.target.value; if (!/^\d*$/.test(value)) return; setToken(value); if (value.length === 6) submitCode(value); }} />
        </FormField>
        <SubmitButton pending={mutation.isPending} pendingLabel="Comprobando código…" disabled={token.length !== 6}>Comprobar código</SubmitButton>
      </form>
      <nav className="ra-form-nav" aria-label="Ayuda con la recuperación"><Link to="/auth/forgot-password">Solicitar un nuevo código</Link><Link to="/auth/login">Volver a iniciar sesión</Link></nav>
    </>
  );
}
