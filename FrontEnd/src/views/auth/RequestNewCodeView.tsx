import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { RequestConfirmationCode } from "../../api/AuthApi";
import { ActionLink } from "../../design-system/components";
import { FormField, FormNotice, SubmitButton } from "../../design-system/forms";

type EmailForm = { email: string };
export default function RequestNewCodeView() {
  const location = useLocation();
  const state = location.state as { email?: string } | null;
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<EmailForm>({ defaultValues: { email: typeof state?.email === "string" ? state.email : "" } });
  const mutation = useMutation({ mutationFn: RequestConfirmationCode });
  return (
    <>
      <title>Un nuevo código. — ReptileApp</title>
      <h1>Un nuevo código.</h1><p className="auth-intro">Solicita otro código de confirmación para activar tu cuenta.</p>
      {mutation.isSuccess ? <div className="auth-outcome"><FormNotice tone="success">{mutation.data || "Código solicitado. Revisa tu correo."}</FormNotice><p>Introduce el código recibido en la pantalla de confirmación.</p><ActionLink to="/auth/confirm-account" state={{ email: getValues("email") }}>Confirmar mi cuenta</ActionLink><button type="button" className="auth-text-button" onClick={() => mutation.reset()}>Usar otro correo o volver a enviar</button></div> : (
        <form className="ra-form" onSubmit={handleSubmit((data) => { if (!mutation.isPending) mutation.mutate(data); })} noValidate>
          {mutation.isError && <FormNotice tone="error">{mutation.error.message}</FormNotice>}
          <FormField id="request-email" label="Correo electrónico" error={errors.email?.message}><input id="request-email" className="ra-input" type="email" inputMode="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "request-email-error" : undefined} {...register("email", { required: "Ingresa tu correo electrónico", pattern: { value: /\S+@\S+\.\S+/, message: "Ingresa un correo válido" } })} /></FormField>
          <SubmitButton pending={mutation.isPending} pendingLabel="Enviando…">Enviar código</SubmitButton>
        </form>
      )}
      <nav className="ra-form-nav" aria-label="Opciones de acceso"><Link to="/auth/login">Volver a iniciar sesión</Link><Link to="/auth/register">Crear una cuenta</Link></nav>
    </>
  );
}
