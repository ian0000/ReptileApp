import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50
                      flex items-center justify-center px-6"
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            {/* Brand / Title */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-2">🦎</div>
              <h1 className="text-2xl font-extrabold text-gray-900">Reptiles App</h1>
            </div>

            <Outlet />
          </div>
        </div>
      </div>

      <ToastContainer
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        position="top-right"
        autoClose={4000}
      />
    </>
  );
}
