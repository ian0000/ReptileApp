import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AppLayout() {
  return (
    <>
      <header className="bg-gray-800 py-5">
        <div className="max-w-screen mx-auto flex flex-col lg:flex-row justify-between items-center">
          <div className="w-64 ">
            <Link to="/"></Link>
          </div>
        </div>
      </header>
      <section className="max-w-screen mx-auto mt-10 p-5">
        <Outlet />
      </section>
      <footer className="py-5">
        <p className="text-center">todos los derechos reservados {new Date().getFullYear()}</p>
      </footer>
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
