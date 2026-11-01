import { useParams } from "react-router-dom";
import { EditReptileForm } from "../../component/reptil/EditReptilForm";
import { ReptileState } from "../../component/reptil/ReptileState";
import { reptilApiToForm } from "../../utils/reptilAdapters";
import { useReptil } from "../../hooks/useReptil";
export default function EditProjectView() {
  const { id = "" } = useParams();
  const query = useReptil(id);
  return (
    <>
      <ReptileState query={query} />
      {query.data && (
        <EditReptileForm
          key={id}
          data={reptilApiToForm(query.data)}
          reptilId={id}
        />
      )}
    </>
  );
}
