import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
const DashboardView = lazy(() => import("./views/DashboardView"));
const CreateReptilView = lazy(() => import("./views/reptil/CreateReptilView"));
const ReptileDetailsView = lazy(
  () => import("./views/reptil/ReptileDetailsView"),
);
const EditProjectView = lazy(() => import("./views/reptil/EditProjectView"));
const NoteListView = lazy(() => import("./views/nota/NoteListView"));
const LogComidaListView = lazy(
  () => import("./views/logComida/LogComidaListView"),
);
const LogPesajeListView = lazy(
  () => import("./views/logPesaje/LogPesajeListView"),
);
import AuthLayout from "./layout/AuthLayout";
const NotFound = lazy(() => import("./views/404/NotFound"));
const LoginView = lazy(() => import("./views/auth/LoginView"));
const RegisterView = lazy(() => import("./views/auth/RegisterView"));
const ConfirmAccountView = lazy(
  () => import("./views/auth/ConfirmAccountView"),
);
const RequestNewCodeView = lazy(
  () => import("./views/auth/RequestNewCodeView"),
);
const ForgotPasswordView = lazy(
  () => import("./views/auth/ForgotPasswordView"),
);
const NewPasswordView = lazy(() => import("./views/auth/NewPasswordView"));

const WelcomeView = lazy(() => import("./views/public/WelcomeView"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <p className="reptile-design ra-session-state" role="status">
            Cargando ReptileApp…
          </p>
        }
      >
        <Routes>
          <Route
            path="/bienvenida"
            element={
              <Suspense fallback={<p role="status">Cargando ReptileApp…</p>}>
                <WelcomeView />
              </Suspense>
            }
          />
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardView />}></Route>
            <Route
              path="/reptiles/nuevo"
              element={<CreateReptilView />}
            ></Route>
            <Route
              path="/reptiles/:id"
              element={<ReptileDetailsView />}
            ></Route>
            <Route
              path="/reptiles/:id/editar"
              element={<EditProjectView />}
            ></Route>
            <Route
              path="/reptiles/:id/notas"
              element={<NoteListView />}
            ></Route>
            <Route
              path="/reptiles/:id/comidas"
              element={<LogComidaListView />}
            ></Route>
            <Route
              path="/reptiles/:id/pesajes"
              element={<LogPesajeListView />}
            ></Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginView />} />
            <Route path="/auth/register" element={<RegisterView />} />
            <Route
              path="/auth/confirm-account"
              element={<ConfirmAccountView />}
            />
            <Route path="/auth/request-code" element={<RequestNewCodeView />} />
            <Route
              path="/auth/forgot-password"
              element={<ForgotPasswordView />}
            />
            <Route path="/auth/new-password" element={<NewPasswordView />} />
          </Route>
          <Route element={<AppLayout />}>
            <Route path="/404" element={<NotFound />}></Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
