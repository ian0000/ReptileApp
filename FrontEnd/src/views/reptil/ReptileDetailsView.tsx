import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getReptilById } from "../../api/ReptilApi";

export default function ReptilDetailsView() {
  const navigate = useNavigate();
  const params = useParams();
  const reptilId = params.id;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["reptileID", reptilId],
    queryFn: () => getReptilById(reptilId!),
    retry: false,
  });
  if (isLoading) return "Cargando...";
  //   if (isError) {
  //     navigate("/404");
  //   }
  console.log(data);
  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">{data.name}</h1>
      </>
    );
}
