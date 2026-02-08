import { useNavigate, useParams } from "react-router-dom";
import { EditReptileForm } from "../../component/reptil/EditReptilForm";
import { reptilApiToForm } from "../../utils/reptilAdapters";
import { useReptil } from "../../hooks/useReptil";
import { useEffect } from "react";

export default function EditProjectView() {
  const params = useParams();
  const reptilId = params.id!;
  const navigate = useNavigate();

  const { data, isError, isLoading } = useReptil(reptilId);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-400 text-lg animate-pulse">Cargando rep3til...</p>
      </div>
    );
  }

  useEffect(() => {
    if (isError) {
      navigate("/404", { replace: true });
    }
  }, [isError, navigate]);

  if (!data) {
    return null;
  }

  if (data) return <EditReptileForm data={reptilApiToForm(data)} reptilId={reptilId} />;
}
