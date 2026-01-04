import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getReptilById } from "../../api/ReptilApi";
import { EditReptileForm } from "../../component/reptil/EditReptilForm";

export default function EditProjectView() {
  const params = useParams();
  const reptilId = params.id!;
  const navigate = useNavigate();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["editReptil", reptilId],
    queryFn: () => getReptilById(reptilId!),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando reptil...</p>
      </div>
    );
  }

  if (isError || !data) {
    navigate("/404", { replace: true });
    return null;
  }
  if (data) return <EditReptileForm data={data} reptilId={reptilId} />;
}
