import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "../../api/AuthApi";
import { ActionLink } from "../../design-system/components";
import { FormField, FormNotice, SubmitButton } from "../../design-system/forms";
import type { UserRegistrationForm } from "../../types";

export default function RegisterView() {
  const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: { email: "", name: "", password: "", password_confirmation: "" } });
  const password = watch("password");
  const mutation = useMutation({ mutationFn: createAccount });
  return (
    <>
      <title>Crear cuenta — ReptileApp</title>
      <h1>Empieza su historia.</h1><p className="auth-intro">Crea tu cuenta y confirma tu correo para registrar el cuidado de tus reptiles.</p>
      {mutation.isSuccess ? <div className="auth-outcome"><FormNotice tone="success">{mutation.data || "Cuenta creada. Revisa tu correo para obtener el código de confirmación."}</FormNotice><p>Introduce el código recibido para activar el acceso.</p><ActionLink to="/auth/confirm-account" state={{ email: getValues("email") }}>Confirmar mi cuenta</ActionLink><Link to="/auth/request-code" state={{ email: getValues("email") }}>No recibí el código</Link></div> : (
        <form className="ra-form" onSubmit={handleSubmit((data) => { if (!mutation.isPending) mutation.mutate(data); })} noValidate>
          {mutation.isError && <FormNotice tone="error">{mutation.error.message}</FormNotice>}
          <FormField id="register-name" label="Nombre" error={errors.name?.message}><input id="register-name" className="ra-input" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "register-name-error" : undefined} {...register("name", { required: "Ingresa tu nombre" })} /></FormField>
          <FormField id="register-email" label="Correo electrónico" error={errors.email?.message}><input id="register-email" className="ra-input" type="email" autoComplete="email" inputMode="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "register-email-error" : undefined} {...register("email", { required: "Ingresa tu correo electrónico", pattern: { value: /\S+@\S+\.\S+/, message: "Ingresa un correo válido" } })} /></FormField>
          <FormField id="register-password" label="Contraseña" hint="Usa al menos 8 caracteres." error={errors.password?.message}><input id="register-password" className="ra-input" type="password" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby={`register-password-hint${errors.password ? " register-password-error" : ""}`} {...register("password", { required: "Crea una contraseña", minLength: { value: 8, message: "Usa al menos 8 caracteres" } })} /></FormField>
          <FormField id="register-confirmation" label="Repetir contraseña" error={errors.password_confirmation?.message}><input id="register-confirmation" className="ra-input" type="password" autoComplete="new-password" aria-invalid={!!errors.password_confirmation} aria-describedby={errors.password_confirmation ? "register-confirmation-error" : undefined} {...register("password_confirmation", { required: "Repite tu contraseña", validate: (value) => value === password || "Las contraseñas no coinciden" })} /></FormField>
          <SubmitButton pending={mutation.isPending} pendingLabel="Creando cuenta…">Crear cuenta</SubmitButton>
        </form>
      )}
      <nav className="ra-form-nav" aria-label="Opciones de acceso"><p>¿Ya tienes cuenta? <Link to="/auth/login">Iniciar sesión</Link></p></nav>
    </>
  );
}
