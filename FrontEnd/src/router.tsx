import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import DashboardView from "./views/DashboardView";
import CreateReptilView from "./views/reptil/CreateReptilView";
import ReptileDetailsView from "./views/reptil/ReptileDetailsView";
import EditProjectView from "./views/reptil/EditProjectView";
import NoteListView from "./views/nota/NoteListView";
import LogComidaListView from "./views/logComida/LogComidaListView";
import LogPesajeListView from "./views/logPesaje/LogPesajeListView";
import AuthLayout from "./layout/AuthLayout";
import NotFound from "./views/404/NotFound";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import RequestNewCodeView from "./views/auth/RequestNewCodeView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import NewPasswordView from "./views/auth/NewPasswordView";

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
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="/auth/confirm-account" element={<ConfirmAccountView />} />
          <Route path="/auth/request-code" element={<RequestNewCodeView />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordView />} />
          <Route path="/auth/new-password" element={<NewPasswordView />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/404" element={<NotFound />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
