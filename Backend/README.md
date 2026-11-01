# ReptileApp — backend

API Express 5 y TypeScript para autenticación, reptiles y sus historiales de comidas, pesajes y notas. Usa MongoDB/Mongoose para persistencia, JWT Bearer para sesión y Resend para los correos de confirmación y recuperación.

Este refactor cambia el frontend y su tratamiento de errores; no modifica las reglas, modelos, endpoints, permisos o infraestructura del backend.

## Requisitos y ejecución local

Node 22, dentro de `>=22.13.0 <23`, npm, una instancia MongoDB de desarrollo y configuración de correo autorizada.

Desde esta carpeta, en PowerShell:

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Si `.env` ya existe, conservarlo; no sobrescribir configuración local. Sustituir únicamente los valores ficticios de `.env.example` por valores de desarrollo:

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión privada a MongoDB de desarrollo |
| `JWT_SECRET` | Secreto privado de firma |
| `RESEND_API_KEY` | Credencial privada del proveedor de correo |
| `FRONTEND_URL` | Origen del frontend de pruebas, por ejemplo `http://localhost:5173` |
| `CORS_ORIGINS` | Orígenes adicionales explícitamente permitidos |
| `API_PUBLIC_URL` | Origen anunciado en Swagger, por ejemplo `http://localhost:4000` |
| `PORT` | Puerto HTTP; por defecto `4000` |
| `NODE_ENV` | Entorno de ejecución |

Los secretos no se copian al frontend ni se incluyen en commits o capturas. El proceso conecta a MongoDB antes de escuchar. El remitente definido en `src/emails/AuthEmail.ts` debe estar autorizado en Resend; probar correo solo con cuentas y destinatarios autorizados.

## Comandos reales

| Comando | Acción |
| --- | --- |
| `npm ci` | Instalación reproducible desde `package-lock.json` |
| `npm run dev` | nodemon + ts-node sobre `src/index.ts` |
| `npm run build` | Compilación TypeScript mediante `tsc` |
| `npm start` | Ejecuta `dist/index.js`, después de build |

El backend no declara scripts de lint ni tests automatizados. Las pruebas `test:contracts` del frontend simulan el adaptador HTTP y no son pruebas del servidor ni de MongoDB/Resend.

## Superficies de la API

- `/api/auth`: registro, confirmación, login y recuperación de acceso.
- `/api/reptiles`: ejemplares e historiales, según los routers y middlewares existentes.
- `/health`: comprobación pública de disponibilidad HTTP.
- `/api-docs` y `/api-docs.json`: documentación Swagger/OpenAPI.

El cliente configura `VITE_API_URL` con `/api` una sola vez y envía el token mediante `Authorization: Bearer …`. No cambiar contratos o validaciones del servidor para adaptar un formulario visual.

## Alcance de QA y operación

Usar una base y cuentas de prueba para operaciones de escritura. No borrar, crear o modificar datos de producción para revisar el diseño. El inventario de riesgos de contratos/ownership está en [FRONTEND_REFACTOR.md](../docs/FRONTEND_REFACTOR.md); su documentación no implica que se hayan corregido autorizaciones del servidor.

La arquitectura y configuración vigentes de Cloudflare Pages, Railway, MongoDB Atlas y Resend están en [deployment.md](../docs/deployment.md). El usuario autorizó posteriormente la publicación del frontend validado a través de main y el pipeline existente. Esta autorización no permite modificar las reglas del backend ni la infraestructura; la disponibilidad de producción requiere una verificación separada del commit desplegado.
