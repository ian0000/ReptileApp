import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import DashboardView from "./views/DashboardView";
import CreateReptilViews from "./views/reptil/CreateReptilViews";
import ReptileDetailsView from "./views/reptil/ReptileDetailsView";
import EditProjectView from "./views/reptil/EditProjectView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />}></Route>
          <Route path="/reptiles/nuevo" element={<CreateReptilViews />}></Route>
          <Route path="/reptiles/:id" element={<ReptileDetailsView />}></Route>
          <Route path="/reptiles/:id/editar" element={<EditProjectView />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
