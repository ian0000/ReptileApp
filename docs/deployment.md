# Producción de ReptileApp

ReptileApp está desplegado en producción en Cloudflare Pages y Railway. MongoDB Atlas conserva los datos y Resend entrega los correos de autenticación. No se migraron los datos ni los contratos de la aplicación.

## Arquitectura actual

```text
Browser
  ↓ https://reptileapp.ian-k.dev
Cloudflare Pages
  ↓ https://api-reptileapp.ian-k.dev/api
Railway → Node.js / Express
  ↓
MongoDB Atlas

Email → Resend
```

## Cloudflare Pages

| Configuración | Valor |
| --- | --- |
| Proyecto | `reptileapp` |
| Repositorio | `ian0000/ReptileApp` |
| Rama de producción | `main` |
| Root directory | `FrontEnd` |
| Instalación local y CI | `npm ci` |
| Build | `npm run build` |
| Output directory | `dist` |
| Node | 22 |
| Dominio de producción | `https://reptileapp.ian-k.dev` |
| Fallback | `https://reptileapp.pages.dev` |

```dotenv
VITE_API_URL=https://api-reptileapp.ian-k.dev/api
```

La variable incluye `/api` una sola vez: las llamadas del cliente comienzan en `/auth` o `/reptiles`. Las variables `VITE_*` se incorporan al bundle público; no deben contener secretos.

La SPA utiliza `BrowserRouter`. Pages sirve el fallback SPA al no existir un `404.html` superior. Comprobar navegación directa y refresh de `/auth/login`, `/reptiles/nuevo`, `/reptiles/:id` y sus rutas de edición, notas, comidas y pesajes. Las rutas protegidas requieren una sesión válida.

## Railway

| Configuración | Valor |
| --- | --- |
| Proyecto | `ReptileApp` |
| Servicio | `backend` |
| Rama de producción | `main` |
| Root directory | `Backend` |
| Build | `npm run build` |
| Start | `npm start` |
| Healthcheck | `/health` |
| Node | 22 |
| Dominio de producción | `https://api-reptileapp.ian-k.dev` |
| Fallback | `https://backend-production-f5fc3.up.railway.app` |

`Backend/railway.json` registra build, start, healthcheck y política de reinicio. El proceso conecta a MongoDB antes de escuchar; Railway suministra el puerto. `GET /health` es público y devuelve `{"status":"ok"}`.

El cierre aplicó únicamente la variable CORS y generó el deployment `55310235-6914-408f-82ce-53ca88576787`, ACTIVE, con conexión MongoDB y healthcheck aprobados. Conserva el código de `main` anterior al merge de esta rama.

Configuración pública final:

```dotenv
FRONTEND_URL=https://reptileapp.ian-k.dev
CORS_ORIGINS=https://reptileapp.ian-k.dev,https://reptileapp.pages.dev
API_PUBLIC_URL=https://api-reptileapp.ian-k.dev
NODE_ENV=production
```

Los secretos de conexión, firma de JWT y Resend se administran en las variables privadas de Railway. No se incluyen sus valores en este documento. El correo de autenticación usa Resend; no requiere las variables SMTP del proveedor de pruebas.

## MongoDB y correo

MongoDB Atlas utiliza un usuario de producción limitado a `readWrite @ reptilapp`. La credencial expuesta durante la migración fue revocada. Este cierre no cambia credenciales, roles, datos ni configuración de Atlas.

Resend sigue siendo el proveedor de correo. El remitente definido en `Backend/src/emails/AuthEmail.ts` debe estar autorizado en Resend. La autenticación conserva JWT Bearer y el comportamiento existente de la aplicación.

## CORS

La allowlist final contiene únicamente:

- `https://reptileapp.ian-k.dev`
- `https://reptileapp.pages.dev`

Las solicitudes sin `Origin`, como los healthchecks, siguen permitidas. Se conserva `credentials: true`. Los demás orígenes son rechazados; no se autoriza automáticamente un sufijo de proveedor ni cualquier preview de Pages.

**Estado del cierre:** el código de esta rama elimina la excepción heredada de Vercel. Su retirada efectiva de producción requiere PR manual, merge a `main`, auto-deploy de Railway y comprobación CORS posterior. Cambiar solamente la variable de Railway no cambia esa lógica del código desplegado.

La comprobación de producción después del cambio de variable permitió los dos orígenes nuevos (OPTIONS 204), rechazó el dominio legacy (HTTP 500 sin `Access-Control-Allow-Origin`) y todavía permitió un preview ficticio de Vercel. La prueba local del código de esta rama rechazó también ese preview y un origen Pages no configurado; permitió ambos orígenes exactos y solicitudes sin `Origin`.

## DNS y dominios

| Nombre | Tipo | Destino actual |
| --- | --- | --- |
| `reptileapp.ian-k.dev` | CNAME | `reptileapp.pages.dev` |
| `api-reptileapp.ian-k.dev` | CNAME | `jgv0spfo.up.railway.app`, destino asignado por Railway |

El destino DNS asignado por Railway puede diferir del fallback público del servicio. Conservar el registro TXT de verificación de la API.

El portfolio es independiente de ReptileApp: `ian-k.dev` apunta a `ian-k-dev.pages.dev`. Durante el cierre se corrigió, con autorización expresa, únicamente el CNAME de `www.ian-k.dev`, que todavía apuntaba al proveedor anterior, para apuntar también a `ian-k-dev.pages.dev`. Se conservó la redirección 301 de `www` hacia el portfolio y ambos responden correctamente. No se modificó el registro del dominio raíz.

## CI/CD

`.github/workflows/ci.yml` usa Node 22 en push y pull request:

- Backend: `npm ci` y `npm run build`.
- Frontend: `npm ci`, `npm run build` y `npm run lint`.

Los paquetes no declaran un script de tests automatizados. Las integraciones Git de Cloudflare Pages y Railway despliegan `main`; GitHub Actions valida el código y no duplica CD. Este cierre se entrega en `chore/deployment-closeout`, sin PR ni merge automático.

## Operación y verificación

Antes y después de cambios operativos, comprobar frontend principal y fallback, `/health`, `/api-docs`, `/api-docs.json` y el fallback Railway. OpenAPI debe anunciar `https://api-reptileapp.ian-k.dev`, sin añadir `/api` al servidor porque los paths ya lo incluyen.

Probar preflight OPTIONS desde los dos orígenes permitidos y desde un origen ajeno; un origen rechazado no debe recibir `Access-Control-Allow-Origin`. Revisar que el deployment esté ACTIVE, la conexión MongoDB sea exitosa y no haya errores críticos de arranque.

El smoke autenticado de la migración fue aprobado previamente: login, usuario actual, persistencia de sesión, CRUD de reptil y de notas/pesajes/comidas, cleanup, logout, CORS y SPA. Este cierre verifica infraestructura y no modifica datos de usuarios.

Ante un fallo, recuperar una versión anterior válida o corregir configuración en Cloudflare Pages y Railway. No restaurar tráfico hacia infraestructura legacy retirada. Preservar MongoDB y Resend.

## Infraestructura legacy: registro histórico del cierre

Las siguientes referencias son históricas, no configuración activa del frontend nuevo:

- Vercel `reptile-app`: pausado y Git desconectado; eliminación definitiva pendiente de confirmación final.
- `reptiles.ian-k.dev`: CNAME legacy identificado; retirada pendiente de confirmación final.
- Worker Cloudflare `apireptiles`: sin Git, URLs, dominios, rutas ni bindings; eliminación pendiente de confirmación final.
- Backend Railway anterior `iankreptiles-production.up.railway.app`: no disponible, HTTP 404 y `Application not found`, comprobado durante el cierre.

Se retira `FrontEnd/vercel.json`, configuración obsoleta del proveedor anterior. No hay instrucciones de rollback hacia esos recursos.

## Seguimientos no bloqueantes

Estos hallazgos quedan fuera de alcance y no se corrigen en este cierre:

1. Notas: la opción visual “Sin tag” es rechazada por el backend.
2. Comidas: “Suplemento” es obligatorio, pero el formulario no lo comunica claramente.
3. Algunos listados requieren refresh después de mutaciones.
4. Revisar por separado las 22 alertas npm registradas en el smoke anterior. En el cierre, `npm ci` reportó 20 en Backend y 33 en FrontEnd (53 en total, incluida una crítica en FrontEnd); el conteo del registro ha cambiado. No actualizar dependencias ni ejecutar `npm audit fix --force` dentro del cierre.
5. Revisar el warning de bundle Vite mayor de 500 kB en otra tarea.
6. El rechazo CORS puede devolver HTTP 500; evaluar una respuesta más apropiada por separado.
