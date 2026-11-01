import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./tokens.css";
import "./forms.css";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="ra-field">
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={`${id}-hint`} className="ra-field-hint">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="ra-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pending?: boolean;
  pendingLabel?: string;
};

export function SubmitButton({
  pending = false,
  pendingLabel = "Guardando…",
  children,
  className = "",
  disabled,
  type = "submit",
  ...props
}: SubmitButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={pending || disabled}
      aria-busy={pending}
      className={`ra-submit ${className}`.trim()}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

type FormNoticeProps = {
  tone: "error" | "success";
  children: ReactNode;
};

export function FormNotice({ tone, children }: FormNoticeProps) {
  return (
    <div
      className={`ra-notice ra-notice--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
