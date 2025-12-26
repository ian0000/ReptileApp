import { useMutation } from "@tanstack/react-query";
import type { ReptilFormData } from "../../types";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { createReptil } from "../../api/ReptilApi";
import { useForm } from "react-hook-form";
import ReptilForm from "../../component/reptil/ReptilForm";

export default function CreateReptilViews() {
  const navigate = useNavigate();

  const initialValues: ReptilFormData = {
    name: "",
    birthDate: new Date(),
    description: "",
    genre: 1,
  };

  const { mutate } = useMutation({
    mutationFn: createReptil,
    onError: (error: Error) => {
      // Handle error
      toast.error(error.message);
    },
    onSuccess: (data) => {
      // Handle success
      toast.success(data);
      navigate("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReptilFormData>({
    defaultValues: initialValues,
  });

  const handleForm = (formData: ReptilFormData) => {
    mutate(formData);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Crear Nuevo Reptil</h1>

        <nav className="my-5">
          <Link to="/" className="text-blue-500 hover:text-blue-700 font-bold">
            Volver a la lista de reptiles
          </Link>
        </nav>

        <form
          onSubmit={handleSubmit(handleForm)}
          className="space-y-4 bg-white p-4 rounded shadow"
          noValidate
        >
          <ReptilForm register={register} errors={errors} />
          <input
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white p-3 uppercase font-bold cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
