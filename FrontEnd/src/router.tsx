import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import DashboardView from "./views/DashboardView";
import CreateReptilViews from "./views/reptil/CreateReptilViews";
import ReptileDetailsView from "./views/reptil/ReptileDetailsView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardView />}></Route>
          <Route path="/reptiles/nuevo" element={<CreateReptilViews />}></Route>
          <Route path="/reptiles/:id" element={<ReptileDetailsView />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
