import { Link } from "react-router-dom";
import { FormNotice } from "../../design-system/forms";
export function ReptileState({
  query,
}: {
  query: {
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => unknown;
  };
}) {
  if (query.isLoading)
    return (
      <p className="ra-reptile-state" role="status">
        Cargando tus reptiles…
      </p>
    );
  if (query.isError)
    return (
      <div className="ra-reptile-state">
        <FormNotice tone="error">
          {query.error?.message || "No pudimos cargar la información."}
        </FormNotice>
        <div className="ra-form-nav">
          <button
            className="ra-submit"
            type="button"
            onClick={() => query.refetch()}
          >
            Volver a intentar
          </button>
          <Link to="/">Volver a mis reptiles</Link>
        </div>
      </div>
    );
  return null;
}
