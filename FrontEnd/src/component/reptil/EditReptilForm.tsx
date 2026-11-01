import { Link, useNavigate } from "react-router-dom";
import type { ReptilFormData } from "../../types";
import { useForm } from "react-hook-form";
import ReptilForm from "./ReptilForm";
import { formatDateForInput } from "../../utils/utils";
import { useUpdateReptil } from "../../hooks/useUpdateReptil";
import { FormNotice, SubmitButton } from "../../design-system/forms";
import "./reptiles.css";
export const EditReptileForm = ({
  data,
  reptilId,
}: {
  data: ReptilFormData;
  reptilId: string;
}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReptilFormData>({
    defaultValues: { ...data, birthDate: formatDateForInput(data.birthDate) },
  });
  const mutation = useUpdateReptil(reptilId, () =>
    navigate("/reptiles/" + reptilId),
  );
  return (
    <section className="ra-reptile-editor">
      <Link className="ra-reptile-back" to={"/reptiles/" + reptilId}>
        Volver a la ficha
      </Link>
      <h1>Editar {data.name}</h1>
      <p>Actualiza sus datos sin perder el historial de cuidado.</p>
      <form
        className="ra-form ra-reptile-form"
        noValidate
        onSubmit={handleSubmit((formData) => {
          if (!mutation.isPending) mutation.mutate(formData);
        })}
      >
        <fieldset disabled={mutation.isPending}>
          <ReptilForm register={register} errors={errors} />
        </fieldset>
        {mutation.error && (
          <FormNotice tone="error">{mutation.error.message}</FormNotice>
        )}
        <div className="ra-form-nav">
          <SubmitButton pending={mutation.isPending}>
            Guardar cambios
          </SubmitButton>
          <Link to={"/reptiles/" + reptilId}>Cancelar</Link>
        </div>
      </form>
    </section>
  );
};
