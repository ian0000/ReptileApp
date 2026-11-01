import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/AuthApi";
import { ActionLink } from "../../design-system/components";
import { FormField, FormNotice, SubmitButton } from "../../design-system/forms";

type EmailForm = { email: string };
export default function ForgotPasswordView() {
  const location = useLocation();
  const state = location.state as { email?: string } | null;
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<EmailForm>({ defaultValues: { email: typeof state?.email === "string" ? state.email : "" } });
  const mutation = useMutation({ mutationFn: forgotPassword });
  return (
    <>
      <title>Recupera tu acceso. — ReptileApp</title>
      <h1>Recupera tu acceso.</h1><p className="auth-intro">Te enviaremos por correo un código para restablecer tu contraseña.</p>
      {mutation.isSuccess ? <div className="auth-outcome"><FormNotice tone="success">{mutation.data || "Solicitud enviada. Revisa tu correo."}</FormNotice><p>Cuando tengas el código, continúa para elegir una contraseña nueva.</p><ActionLink to="/auth/new-password" state={{ email: getValues("email") }}>Ya tengo el código</ActionLink><button type="button" className="auth-text-button" onClick={() => mutation.reset()}>Usar otro correo o volver a enviar</button></div> : (
        <form className="ra-form" onSubmit={handleSubmit((data) => { if (!mutation.isPending) mutation.mutate(data); })} noValidate>
          {mutation.isError && <FormNotice tone="error">{mutation.error.message}</FormNotice>}
          <FormField id="forgot-email" label="Correo electrónico" error={errors.email?.message}><input id="forgot-email" className="ra-input" type="email" inputMode="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "forgot-email-error" : undefined} {...register("email", { required: "Ingresa tu correo electrónico", pattern: { value: /\S+@\S+\.\S+/, message: "Ingresa un correo válido" } })} /></FormField>
          <SubmitButton pending={mutation.isPending} pendingLabel="Enviando…">Enviar instrucciones</SubmitButton>
        </form>
      )}
      <nav className="ra-form-nav" aria-label="Opciones de acceso"><Link to="/auth/login">Volver a iniciar sesión</Link><Link to="/auth/register">Crear una cuenta</Link></nav>
    </>
  );
}
