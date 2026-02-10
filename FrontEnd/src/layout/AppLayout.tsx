import { Link, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getReptiles } from "../api/ReptilApi";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useAuth();

  const { data: reptilesData } = useQuery({
    queryKey: ["reptiles"],
    queryFn: getReptiles,
    enabled: !!data,
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando reptil...</p>
      </div>
    );
  }
  if (isError) {
    return <Navigate to="/auth/login" replace />;
  }
  const reptileCount = reptilesData?.length ?? 0;

  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    queryClient.resetQueries({ queryKey: ["user"] });
  };

  return (
    <div
      className="min-h-screen flex flex-col
                    bg-gradient-to-br from-emerald-50 via-white to-sky-50
                    dark:from-gray-900 dark:via-gray-900 dark:to-gray-800
                    transition-colors"
    >
      {/* Header */}
      <header
        className="bg-white/80 dark:bg-gray-900/80
                         backdrop-blur-md shadow-sm
                         sticky top-0 z-50"
      >
        <div
          className="max-w-7xl mx-auto px-6 py-4
                        flex justify-between items-center"
        >
          {/* Brand */}
          <Link
            to="/"
            className="text-2xl font-extrabold
                       bg-gradient-to-r from-emerald-500 to-sky-500
                       bg-clip-text text-transparent"
          >
            ReptilApp 🦎
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="relative font-semibold
                         text-gray-600 dark:text-gray-300
                         hover:text-emerald-600 dark:hover:text-emerald-400
                         transition"
            >
              Dashboard
              {/* Badge */}
              <span
                className="absolute -top-2 -right-4
                           bg-emerald-500 text-white
                           text-xs font-bold
                           w-5 h-5 rounded-full
                           flex items-center justify-center
                           shadow"
              >
                {reptileCount}
              </span>
            </Link>

            <Link
              to="/reptiles/nuevo"
              className="px-4 py-2 rounded-lg
                         bg-gradient-to-r from-emerald-500 to-sky-500
                         hover:from-emerald-600 hover:to-sky-600
                         text-white font-bold
                         shadow transition"
            >
              + Reptil
            </Link>
            {/* Cerrar sesión */}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg
               border border-gray-200 dark:border-gray-700
               text-gray-600 dark:text-gray-300
               hover:bg-red-50 hover:text-red-600
               dark:hover:bg-red-900/30 dark:hover:text-red-400
               transition font-semibold"
            >
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="bg-white/70 dark:bg-gray-900/70
                         backdrop-blur border-t
                         border-gray-200 dark:border-gray-700 mt-16"
      >
        <p className="text-center text-gray-500 dark:text-gray-400 py-6 text-sm">
          © {new Date().getFullYear()} ReptilApp · Todos los derechos reservados
        </p>
      </footer>

      {/* Toast */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        newestOnTop
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        closeOnClick
        draggable
        limit={3}
        className="!z-[9999] mt-20"
        toastStyle={{
          borderRadius: "0.75rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        }}
        toastClassName="
    bg-white dark:bg-gray-800
    text-gray-800 dark:text-gray-100
  "
      />
    </div>
  );
}
