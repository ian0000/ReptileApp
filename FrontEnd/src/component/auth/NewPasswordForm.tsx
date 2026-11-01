import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "../../api/AuthApi";
import type { NewPasswordForm as NewPasswordFormData } from "../../types";
import { FormField, FormNotice, SubmitButton } from "../../design-system/forms";

type Props = { token: string };
export default function NewPasswordForm({ token }: Props) {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<NewPasswordFormData>({ defaultValues: { password: "", password_confirmation: "" } });
  const password = watch("password");
  const mutation = useMutation({ mutationFn: updatePasswordWithToken, onSuccess: (data) => navigate("/auth/login", { replace: true, state: { notice: data || "Contraseña actualizada. Inicia sesión con tu nueva contraseña." } }) });
  return (
    <>
      <form className="ra-form" onSubmit={handleSubmit((formData) => { if (!mutation.isPending) mutation.mutate({ formData, token }); })} noValidate>
        {mutation.isError && <FormNotice tone="error">{mutation.error.message}</FormNotice>}
        <FormField id="new-password" label="Nueva contraseña" hint="Usa al menos 8 caracteres." error={errors.password?.message}>
          <input id="new-password" className="ra-input" type="password" autoComplete="new-password" autoFocus aria-invalid={!!errors.password} aria-describedby={`new-password-hint${errors.password ? " new-password-error" : ""}`} {...register("password", { required: "Crea una contraseña", minLength: { value: 8, message: "Usa al menos 8 caracteres" } })} />
        </FormField>
        <FormField id="new-confirmation" label="Repetir contraseña" error={errors.password_confirmation?.message}>
          <input id="new-confirmation" className="ra-input" type="password" autoComplete="new-password" aria-invalid={!!errors.password_confirmation} aria-describedby={errors.password_confirmation ? "new-confirmation-error" : undefined} {...register("password_confirmation", { required: "Repite tu contraseña", validate: (value) => value === password || "Las contraseñas no coinciden" })} />
        </FormField>
        <SubmitButton pending={mutation.isPending} pendingLabel="Actualizando contraseña…">Establecer contraseña</SubmitButton>
      </form>
      <nav className="ra-form-nav" aria-label="Opciones de acceso"><Link to="/auth/forgot-password">Solicitar otro código</Link><Link to="/auth/login">Volver a iniciar sesión</Link></nav>
    </>
  );
}
