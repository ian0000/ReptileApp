import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticateUser } from "../../api/AuthApi";
import { FormField, FormNotice, SubmitButton } from "../../design-system/forms";
import type { UserLoginForm } from "../../types";

export default function LoginView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const state = location.state as { notice?: string; email?: string } | null;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginForm>({
    defaultValues: {
      email: typeof state?.email === "string" ? state.email : "",
      password: "",
    },
  });
  const mutation = useMutation({
    mutationFn: authenticateUser,
    onSuccess: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });
  return (
    <>
      <title>Iniciar sesión — ReptileApp</title>
      <h1>Iniciar sesión</h1>
      <p className="auth-intro">
        Vuelve a los ejemplares y registros de tu cuenta.
      </p>
      <form
        className="ra-form"
        onSubmit={handleSubmit((data) => {
          if (!mutation.isPending) mutation.mutate(data);
        })}
        noValidate
      >
        {typeof state?.notice === "string" && (
          <FormNotice tone="success">{state.notice}</FormNotice>
        )}
        {mutation.isError && (
          <FormNotice tone="error">{mutation.error.message}</FormNotice>
        )}
        <FormField
          id="login-email"
          label="Correo electrónico"
          error={errors.email?.message}
        >
          <input
            id="login-email"
            className="ra-input"
            type="email"
            autoComplete="username"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email", {
              required: "Ingresa tu correo electrónico",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Ingresa un correo válido",
              },
            })}
          />
        </FormField>
        <FormField
          id="login-password"
          label="Contraseña"
          error={errors.password?.message}
        >
          <input
            id="login-password"
            className="ra-input"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            {...register("password", { required: "Ingresa tu contraseña" })}
          />
        </FormField>
        <Link to="/auth/forgot-password">¿Olvidaste tu contraseña?</Link>
        <SubmitButton
          pending={mutation.isPending}
          pendingLabel="Iniciando sesión…"
        >
          Iniciar sesión
        </SubmitButton>
      </form>
      <nav className="ra-form-nav" aria-label="Opciones de acceso">
        <p>
          ¿Aún no tienes cuenta? <Link to="/auth/register">Crear cuenta</Link>
        </p>
        <Link to="/auth/confirm-account">Confirmar mi cuenta</Link>
      </nav>
    </>
  );
}
