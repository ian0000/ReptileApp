# Despliegue de ReptileApp

Este documento prepara la migración sin ejecutar despliegues, cambiar DNS ni retirar la infraestructura anterior.

## Arquitectura objetivo

```text
Browser
  -> https://reptileapp.ian-k.dev
  -> Cloudflare Pages
  -> https://api-reptileapp.ian-k.dev
  -> Railway
  -> Node.js / Express
  -> MongoDB Atlas existente

Email -> Resend existente
```

La autenticación sigue usando JWT Bearer, `AUTH_TOKEN` en `localStorage` y bcrypt con costo 10. No se migran MongoDB, Mongoose, hashes, JWT ni Resend.

## Cloudflare Pages

| Opción | Valor |
| --- | --- |
| Repositorio | `ian0000/ReptileApp` |
| Rama de producción | La rama principal del repositorio después del merge aprobado |
| Root directory | `/FrontEnd` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | 22 |
| Variable | `VITE_API_URL=https://api-reptileapp.ian-k.dev/api` |
| Dominio | `reptileapp.ian-k.dev` |

El cliente Axios usa `VITE_API_URL` como URL base y sus llamadas empiezan en `/auth` o `/reptiles`; por eso la variable incluye `/api` una sola vez.

La aplicación es una SPA de Vite con `BrowserRouter`. Cloudflare Pages aplica el fallback SPA cuando no existe un `404.html` de nivel superior. Después del despliegue se deben abrir directamente y refrescar estas rutas reales:

- `/`
- `/auth/login`
- `/auth/register`
- `/reptiles/nuevo`
- `/reptiles/:id`
- `/reptiles/:id/editar`
- `/reptiles/:id/notas`
- `/reptiles/:id/comidas`
- `/reptiles/:id/pesajes`

## Railway

| Opción | Valor |
| --- | --- |
| Root directory | `/Backend` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Healthcheck | `/health` |
| Node | 22 |
| Dominio | `api-reptileapp.ian-k.dev` |

`Backend/railway.json` registra build, start, healthcheck y reinicio. Railway está retirando Configuration as Code para servicios nuevos; si el servicio no aplica el archivo, configurar manualmente los mismos valores en Railway. No se necesita Docker ni configuración manual de Nixpacks.

El proceso espera una conexión exitosa con MongoDB antes de abrir el puerto. Railway suministra `PORT`; la aplicación conserva el fallback local 4000. `GET /health` es público, no consulta datos y devuelve `{"status":"ok"}`.

## Variables

### Backend en Railway

- `DATABASE_URL`
- `JWT_SECRET`
- `RESEND_API_KEY`
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `API_PUBLIC_URL`
- `NODE_ENV`
- `PORT` (suministrada por Railway)

Valores públicos de producción:

```dotenv
FRONTEND_URL=https://reptileapp.ian-k.dev
CORS_ORIGINS=https://reptiles.ian-k.dev,https://reptileapp.ian-k.dev,https://<deployment>.pages.dev
API_PUBLIC_URL=https://api-reptileapp.ian-k.dev
NODE_ENV=production
```

Reemplazar `<deployment>.pages.dev` por el hostname exacto asignado por Cloudflare. Mantener temporalmente el frontend anterior y los previews `*.vercel.app` durante la transición. Las solicitudes sin `Origin`, como el healthcheck, siguen permitidas. No se configuran variables SMTP porque el flujo activo usa Resend.

### Frontend en Cloudflare Pages

- `VITE_API_URL`

```dotenv
VITE_API_URL=https://api-reptileapp.ian-k.dev/api
```

Configurar la variable tanto para producción como para los previews que deban hablar con la API. No guardar secretos en variables `VITE_*`, porque se incorporan al bundle público.

## Swagger y CORS

Swagger queda disponible en `/api-docs` y `/api-docs.json`. `API_PUBLIC_URL` define el servidor anunciado por OpenAPI y no incluye `/api`, porque los paths documentados ya lo contienen.

CORS permite `FRONTEND_URL`, la lista exacta de `CORS_ORIGINS`, los previews heredados `*.vercel.app` y solicitudes sin `Origin`. Se conserva `credentials: true` y el encabezado `Authorization` del JWT Bearer.

## CI y CD

`.github/workflows/ci.yml` usa Node 22 y comprueba en cada push y pull request:

- Backend: `npm ci` y `npm run build`.
- Frontend: `npm ci`, `npm run build` y `npm run lint`.

No existe un script de tests automatizados en los paquetes actuales. El despliegue continuo posterior queda a cargo de las integraciones Git de Cloudflare Pages y Railway; GitHub Actions no duplica CD.

## DNS requerido

Crear estos registros únicamente cuando cada proveedor entregue su destino exacto:

| Nombre | Tipo esperado | Destino |
| --- | --- | --- |
| `reptileapp` | CNAME | Hostname asignado por Cloudflare Pages |
| `api-reptileapp` | CNAME | Hostname asignado por Railway |

Añadir cualquier TXT de validación que el proveedor solicite. No reutilizar `app.reptileapp.ian-k.dev` ni `api.reptileapp.ian-k.dev`.

En la inspección previa a esta preparación, `reptileapp.ian-k.dev`, `api-reptileapp.ian-k.dev` y `apireptiles.ian-k.dev` no publicaban registros. `reptiles.ian-k.dev` resolvía por CNAME a Vercel. Esta información debe volver a verificarse antes del cambio de DNS.

## Smoke test de producción

### Backend

- [ ] `GET https://api-reptileapp.ian-k.dev/health` responde 200 y `{"status":"ok"}`.
- [ ] Swagger abre en `/api-docs` y OpenAPI en `/api-docs.json` anuncia el dominio nuevo.
- [ ] El preflight OPTIONS desde Cloudflare Pages recibe el origen permitido.
- [ ] Un origen no configurado no recibe acceso CORS.
- [ ] Los logs no muestran errores críticos ni valores sensibles.

### Autenticación y correo

- [ ] Crear una sola cuenta ficticia de prueba.
- [ ] Recibir el correo de confirmación por Resend y confirmar la cuenta.
- [ ] Iniciar sesión y obtener el usuario autenticado.
- [ ] Editar el perfil y comprobar la contraseña.
- [ ] Solicitar recuperación, recibir el correo y validar el token.
- [ ] Cerrar sesión. Evitar reenvíos repetidos durante la prueba.

### Reptiles y tracking

- [ ] Crear, listar, abrir y editar un reptil ficticio.
- [ ] Crear, editar y eliminar una nota ficticia.
- [ ] Crear, editar y eliminar un pesaje ficticio.
- [ ] Crear, editar y eliminar una comida ficticia.
- [ ] Comprobar de forma segura que un usuario no puede modificar recursos de otro propietario.

### Frontend

- [ ] Iniciar sesión en `https://reptileapp.ian-k.dev`.
- [ ] Confirmar que las llamadas usan `https://api-reptileapp.ian-k.dev`.
- [ ] Navegar por las rutas reales y refrescar cada ruta sin obtener 404.
- [ ] Confirmar logout y navegación posterior.

## Infraestructura anterior y rollback

Mantener hasta que todo el smoke test esté aprobado:

- Proyecto Vercel `reptile-app`, incluido `reptiles.ian-k.dev`.
- Backend anterior en `https://iankreptiles-production.up.railway.app`, cuya propiedad y proyecto actual no se determinaron en la inspección.
- MongoDB Atlas y Resend existentes.
- Cualquier DNS o servicio legacy que aparezca durante la activación.

No se encontró un servicio ReptileApp en el proyecto Render inspeccionado. Tampoco se determinó un Worker de Cloudflare asociado. No retirar Vercel, el backend anterior ni DNS hasta comprobar Railway, MongoDB, Resend, auth, CRUD, tracking, Pages, dominios personalizados, CORS y logs.

Si el despliegue nuevo falla, mantener o restaurar el tráfico hacia Vercel y el backend anterior, corregir la configuración fuera de producción y repetir el smoke test antes de intentar otra migración.

## Seguimientos fuera de alcance

- Confirmar la propiedad y el proyecto del backend Railway anterior antes de retirarlo.
- Revisar por separado las vulnerabilidades reportadas por `npm audit`; no aplicar actualizaciones mayores dentro de esta migración.
- Revisar en una tarea separada los envíos de correo que no esperen explícitamente la promesa de Resend, si los logs reales muestran pérdida de envíos.
