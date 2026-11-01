import { Link, Outlet } from "react-router-dom";
import { BrandMark } from "../design-system/components";
import "../design-system/forms.css";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="reptile-design auth-page">
      <a className="auth-skip" href="#auth-main">Saltar al formulario</a>
      <aside className="auth-story" aria-label="ReptileApp">
        <Link to="/bienvenida" className="auth-brand" aria-label="ReptileApp — Bienvenida"><BrandMark /></Link>
        <div className="auth-story-copy"><p>Cada reptil,<br /><span>su historia.</span></p><p>Comidas, pesajes y notas para volver a consultar el cuidado de cada ejemplar.</p></div>
        <img src="/images/reptileapp-gecko.webp" width="1000" height="914" alt="" className="auth-gecko" />
        <Link className="auth-return" to="/bienvenida">Volver a la bienvenida</Link>
      </aside>
      <main id="auth-main" className="auth-main" tabIndex={-1}>
        <Link to="/bienvenida" className="auth-mobile-brand" aria-label="ReptileApp — Bienvenida"><BrandMark /></Link>
        <div className="auth-content"><Outlet /></div>
        <p className="auth-footnote">Tu cuenta, tus ejemplares, sus registros.</p>
      </main>
    </div>
  );
}
