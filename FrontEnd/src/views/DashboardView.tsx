import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getReptiles } from "../api/ReptilApi";
import { formatDate } from "../utils/utils";
import { useAuth } from "../hooks/useAuth";
import { ActionLink } from "../design-system/components";
import { ReptileState } from "../component/reptil/ReptileState";
import "../component/reptil/reptiles.css";
export default function DashboardView() {
  const { data: user } = useAuth();
  const query = useQuery({ queryKey: ["reptiles"], queryFn: getReptiles });
  return (
    <section className="ra-reptiles">
      <div className="ra-collection-heading">
        <div>
          <h1>Mis reptiles</h1>
          <p>Un espacio para conocerlos mejor, registro a registro.</p>
        </div>
        <p>Hola, {user?.name}.</p>
      </div>
      <ReptileState query={query} />
      {query.data &&
        (query.data.length ? (
          <ul className="ra-reptile-grid">
            {query.data.map((r, i) => (
              <li className="ra-reptile-card" key={r._id}>
                <div className="ra-reptile-card-top">
                  <span className="ra-reptile-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>Ficha de cuidado</span>
                </div>
                <h2>
                  <Link to={"/reptiles/" + r._id}>{r.name}</Link>
                </h2>
                <dl>
                  <dt>Fecha de nacimiento</dt>
                  <dd>
                    {r.birthDate ? formatDate(r.birthDate) : "Sin registrar"}
                  </dd>
                  {r.owner?._id !== user?._id && (
                    <>
                      <dt>Propietario</dt>
                      <dd>{r.owner?.name || "Sin especificar"}</dd>
                    </>
                  )}
                </dl>
                <Link className="ra-reptile-open" to={"/reptiles/" + r._id}>
                  Ver ficha ↗
                </Link>
                <nav
                  aria-label={"Historiales de " + r.name}
                  className="ra-reptile-links"
                >
                  <Link to={"/reptiles/" + r._id + "/comidas"}>Comidas</Link>
                  <Link to={"/reptiles/" + r._id + "/pesajes"}>Pesajes</Link>
                  <Link to={"/reptiles/" + r._id + "/notas"}>Notas</Link>
                </nav>
              </li>
            ))}
          </ul>
        ) : (
          <div className="ra-reptile-empty">
            <img
              src="/images/reptileapp-gecko.webp"
              alt=""
              width="230"
              height="210"
            />
            <div>
              <h2>Su historia empieza aquí.</h2>
              <p>
                Añade tu primer reptil para reunir sus comidas, pesajes y notas
                en un mismo lugar.
              </p>
              <ActionLink to="/reptiles/nuevo">
                Añadir mi primer reptil
              </ActionLink>
            </div>
          </div>
        ))}
    </section>
  );
}
