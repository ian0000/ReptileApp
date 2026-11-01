import { ActionLink, BrandMark } from "../../design-system/components";
import "../../layout/AppLayout.css";

export default function NotFound() {
  return (
    <div className="reptile-design ra-session-state">
      <title>Página no encontrada — ReptileApp</title>
      <BrandMark />
      <p>404</p>
      <h1>Esta página se nos escapó.</h1>
      <p>Revisa la dirección o vuelve a un lugar conocido.</p>
      <div className="ra-session-actions">
        <ActionLink to="/">Mis reptiles</ActionLink>
        <ActionLink to="/bienvenida" variant="secondary">
          Conoce ReptileApp
        </ActionLink>
      </div>
    </div>
  );
}
