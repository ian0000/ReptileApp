import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import DashboardView from "./views/DashboardView";
import CreateReptilView from "./views/reptil/CreateReptilView";
import ReptileDetailsView from "./views/reptil/ReptileDetailsView";
import EditProjectView from "./views/reptil/EditProjectView";
import NoteListView from "./views/nota/NoteListView";
import LogComidaListView from "./views/logComida/LogComidaListView";
import LogPesajeListView from "./views/logPesaje/LogPesajeListView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />}></Route>
          <Route path="/reptiles/nuevo" element={<CreateReptilView />}></Route>
          <Route path="/reptiles/:id" element={<ReptileDetailsView />}></Route>
          <Route path="/reptiles/:id/editar" element={<EditProjectView />}></Route>
          <Route path="/reptiles/:id/notas" element={<NoteListView />}></Route>
          <Route path="/reptiles/:id/comidas" element={<LogComidaListView />}></Route>
          <Route path="/reptiles/:id/pesajes" element={<LogPesajeListView />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
