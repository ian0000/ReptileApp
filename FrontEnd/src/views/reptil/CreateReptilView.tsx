import type { ReptilFormData } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ReptilForm from "../../component/reptil/ReptilForm";
import { useCreateReptil } from "../../hooks/useCreateReptil";
import { FormNotice, SubmitButton } from "../../design-system/forms";
import "../../component/reptil/reptiles.css";
import { recordError } from "../../component/note/recordError";
export default function CreateReptilView() {
  const navigate = useNavigate();
  const mutation = useCreateReptil(() => navigate("/"));
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReptilFormData>({
    defaultValues: { name: "", birthDate: "", description: "", genre: 1 },
  });
  return (
    <section className="ra-reptile-editor">
      <Link className="ra-reptile-back" to="/">
        Volver a mis reptiles
      </Link>
      <h1>Añadir reptil</h1>
      <p>
        Empieza con sus datos básicos. Los registros de cuidado vendrán después.
      </p>
      <form
        className="ra-form ra-reptile-form"
        noValidate
        onSubmit={handleSubmit((data) => {
          if (!mutation.isPending) mutation.mutate(data);
        })}
      >
        <fieldset disabled={mutation.isPending}>
          <ReptilForm register={register} errors={errors} />
        </fieldset>
        {Boolean(mutation.error) && (
          <FormNotice tone="error">{recordError(mutation.error)}</FormNotice>
        )}
        <div className="ra-form-nav">
          <SubmitButton pending={mutation.isPending}>Crear ficha</SubmitButton>
          <Link to="/">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
