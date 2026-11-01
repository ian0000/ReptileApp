import { Link, NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReptiles } from "../api/ReptilApi";
import { useAuth } from "../hooks/useAuth";
import { ActionLink, BrandMark } from "../design-system/components";
import { FormNotice } from "../design-system/forms";
import "./AppLayout.css";

export default function AppLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data, error, isError, isLoading, refetch } = useAuth();
  const token = localStorage.getItem("AUTH_TOKEN");
  const { data: reptilesData } = useQuery({
    queryKey: ["reptiles"],
    queryFn: getReptiles,
    enabled: !!data && !!token,
  });
  const authError = error;
  const status =
    authError && typeof authError === "object" && "status" in authError
      ? Number(authError.status)
      : undefined;
  const logout = async () => {
    localStorage.removeItem("AUTH_TOKEN");
    await queryClient.cancelQueries();
    queryClient.clear();
    navigate("/auth/login", { replace: true });
  };
  if (!token || (isError && (status === 401 || status === 403))) {
    return <Navigate to="/auth/login" replace />;
  }
  if (isLoading) {
    return (
      <div className="reptile-design ra-session-state" role="status">
        <BrandMark />
        <h1>Preparando tu espacio de cuidado.</h1>
        <p>Comprobando tu sesión…</p>
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="reptile-design ra-session-state">
        <BrandMark />
        <h1>No pudimos conectar con tu cuenta.</h1>
        <FormNotice tone="error">
          La sesión no pudo comprobarse. Puedes reintentar sin perder tus datos.
        </FormNotice>
        <div className="ra-session-actions">
          <button
            type="button"
            className="ra-submit"
            onClick={() => refetch()}
          >
            Volver a intentar
          </button>
          <button
            type="button"
            className="ra-button ra-button--secondary"
            onClick={logout}
          >
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="reptile-design ra-app-shell">
      <a className="ra-app-skip" href="#app-main">
        Saltar al contenido
      </a>
      <header className="ra-app-header">
        <div className="ra-app-header-inner">
          <Link
            to="/"
            className="ra-app-brand"
            aria-label="ReptileApp — Mis reptiles"
          >
            <BrandMark />
          </Link>
          <nav className="ra-app-nav" aria-label="Navegación principal">
            <NavLink to="/" end className="ra-app-home">
              Mis reptiles
              {reptilesData && (
                <span
                  className="ra-app-count"
                  aria-label={`${reptilesData.length} reptiles`}
                >
                  {reptilesData.length}
                </span>
              )}
            </NavLink>
            <ActionLink to="/reptiles/nuevo">Añadir reptil</ActionLink>
            <button type="button" className="ra-app-logout" onClick={logout}>
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>
      <main id="app-main" tabIndex={-1} className="ra-app-main">
        <Outlet />
      </main>
      <footer className="ra-app-footer">
        <p>
          © {new Date().getFullYear()} ReptileApp · Cada reptil, su historia.
        </p>
        <Link to="/bienvenida">Conoce ReptileApp</Link>
      </footer>
      <ToastContainer
        position="bottom-right"
        autoClose={6000}
        newestOnTop
        pauseOnHover
        pauseOnFocusLoss
        closeOnClick={false}
        draggable={false}
        limit={3}
        className="ra-app-toasts"
      />
    </div>
  );
}
