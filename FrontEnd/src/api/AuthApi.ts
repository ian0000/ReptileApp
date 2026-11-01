import { ApiError, normalizeApiError } from "./errors";
import api from "../lib/axios";
import {
  userSchema,
  type CheckPasswordForm,
  type ConfirmToken,
  type ForgotPasswordForm,
  type NewPasswordForm,
  type RequestConfirmationCodeForm,
  type UserLoginForm,
  type UserRegistrationForm,
} from "../types";

export async function createAccount(formData: UserRegistrationForm) {
  try {
    const url = "/auth/create-account";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function confirmAccount(formData: ConfirmToken) {
  try {
    const url = "/auth/confirm-account";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function RequestConfirmationCode(
  formData: RequestConfirmationCodeForm,
) {
  try {
    const url = "/auth/request-code";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function authenticateUser(formData: UserLoginForm) {
  try {
    const url = "/auth/login";
    const { data } = await api.post<string>(url, formData);

    if (typeof data !== "string" || !data.trim()) {
      throw new ApiError(
        "La respuesta de inicio de sesión no es válida. Vuelve a intentarlo.",
      );
    }
    localStorage.setItem("AUTH_TOKEN", data);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function forgotPassword(formData: ForgotPasswordForm) {
  try {
    const url = "/auth/forgot-password";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function validateToken(formData: ConfirmToken) {
  try {
    const url = "/auth/validate-token";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function updatePasswordWithToken({
  formData,
  token,
}: {
  formData: NewPasswordForm;
  token: string;
}) {
  try {
    const url = `/auth/update-password/${token}`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function getUser() {
  try {
    const { data } = await api("/auth/user");
    const response = userSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
    throw new ApiError(
      "La respuesta de tu cuenta no es válida. Vuelve a intentarlo.",
    );
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function checkPassword(formData: CheckPasswordForm) {
  try {
    const url = `/auth/check-password`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}
