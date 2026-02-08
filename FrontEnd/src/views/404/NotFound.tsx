import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50
                    flex items-center justify-center px-6"
    >
      <div className="max-w-lg w-full text-center">
        {/* Big 404 */}
        <p className="text-8xl font-black text-emerald-200 select-none">404</p>

        <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Página no encontrada</h1>

        <p className="mt-3 text-gray-500 text-lg">
          La ruta que intentas visitar no existe o fue movida.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center
                     mt-8 px-6 py-3 rounded-xl
                     bg-gradient-to-r from-emerald-500 to-sky-500
                     hover:from-emerald-600 hover:to-sky-600
                     text-white font-bold
                     shadow-lg transition-all
                     transform hover:-translate-y-0.5"
        >
          ← Volver a Reptiles
        </Link>
      </div>
    </div>
  );
}
