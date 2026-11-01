import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { formatDate, formatGenre } from "../../utils/utils";
import { useReptil } from "../../hooks/useReptil";
import { useDeleteReptil } from "../../hooks/useDeleteReptil";
import { useAuth } from "../../hooks/useAuth";
import Dialog from "../../design-system/Dialog";
import { FormNotice, SubmitButton } from "../../design-system/forms";
import { ActionLink } from "../../design-system/components";
import { ReptileState } from "../../component/reptil/ReptileState";
import "../../component/reptil/reptiles.css";
export default function ReptileDetailsView() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const { data: user } = useAuth();
  const query = useReptil(id);
  const mutation = useDeleteReptil(() => navigate("/"));
  const [deleting, setDeleting] = useState(false);
  const data = query.data;
  return (
    <section className="ra-reptile-detail">
      <Link className="ra-reptile-back" to="/">
        Volver a mis reptiles
      </Link>
      <ReptileState query={query} />
      {data && (
        <>
          <div className="ra-collection-heading">
            <div>
              <h1>{data.name}</h1>
              <p>Cada registro cuenta una parte de su historia.</p>
            </div>
            <ActionLink to={"/reptiles/" + id + "/editar"} variant="secondary">
              Editar ficha
            </ActionLink>
          </div>
          <div className="ra-reptile-overview">
            <div>
              <h2>Acerca de {data.name}</h2>
              <p className="ra-reptile-description">
                {data.description ||
                  "Todavía no hay una descripción. Puedes añadirla al editar la ficha."}
              </p>
            </div>
            <dl>
              <dt>Género</dt>
              <dd>{formatGenre(data.genre)}</dd>
              <dt>Fecha de nacimiento</dt>
              <dd>
                {data.birthDate ? formatDate(data.birthDate) : "Sin registrar"}
              </dd>
              {data.owner?._id !== user?._id && (
                <>
                  <dt>Propietario</dt>
                  <dd>{data.owner?.name || "Sin especificar"}</dd>
                </>
              )}
            </dl>
          </div>
          <h2 className="ra-reptile-care-title">Su cuidado, al día.</h2>
          <div className="ra-reptile-care">
            {[
              [
                "comidas",
                "Comidas",
                "Alimentación, apetito y próximos registros.",
              ],
              [
                "pesajes",
                "Pesajes",
                "Medidas y evolución a lo largo del tiempo.",
              ],
              [
                "notas",
                "Notas",
                "Observaciones y detalles que quieres recordar.",
              ],
            ].map(([path, title, description], i) => (
              <Link key={path} to={"/reptiles/" + id + "/" + path}>
                <span aria-hidden="true">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <strong>Abrir historial ↗</strong>
              </Link>
            ))}
          </div>
          <div className="ra-reptile-danger-zone">
            <details>
              <summary>Identificador de la ficha</summary>
              <p>{data._id}</p>
            </details>
            <button
              className="ra-reptile-delete"
              type="button"
              onClick={() => {
                mutation.reset();
                setDeleting(true);
              }}
            >
              Eliminar reptil
            </button>
          </div>
          <Dialog
            open={deleting}
            onClose={() => {
              if (!mutation.isPending) setDeleting(false);
            }}
            title={"¿Eliminar a " + data.name + "?"}
            description="Esta acción no se puede deshacer. Se eliminarán el reptil y sus registros asociados de comidas, pesajes y notas."
          >
            {mutation.error && (
              <FormNotice tone="error">{mutation.error.message}</FormNotice>
            )}
            <div className="ra-form-nav">
              <button
                className="ra-action ra-action--secondary"
                type="button"
                disabled={mutation.isPending}
                onClick={() => setDeleting(false)}
              >
                Cancelar
              </button>
              <SubmitButton
                type="button"
                className="ra-reptile-delete-confirm"
                pending={mutation.isPending}
                pendingLabel="Eliminando…"
                onClick={() => {
                  if (!mutation.isPending) mutation.mutate(id);
                }}
              >
                Eliminar reptil
              </SubmitButton>
            </div>
          </Dialog>
        </>
      )}
    </section>
  );
}
