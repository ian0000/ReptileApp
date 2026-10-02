# ReptileApp

**Proyecto personal · Seguimiento del cuidado de reptiles**

Aplicación web para mantener la información de cada reptil y registrar su alimentación, pesajes y notas. Reúne una interfaz React y una API Express, ambas escritas en TypeScript.

## Qué incluye

- Registro, inicio de sesión, confirmación de cuenta y recuperación de contraseña.
- Creación, consulta y edición de reptiles.
- Historial de comidas, pesajes y notas por ejemplar.
- API autenticada y documentación Swagger.

## Tecnologías y estructura

| Carpeta | Responsabilidad | Tecnologías |
| --- | --- | --- |
| [FrontEnd](FrontEnd/) | Interfaz y consumo de la API | React, Vite, TypeScript, React Query, React Hook Form |
| [Backend](Backend/) | Autenticación, reglas y persistencia | Node.js, Express, MongoDB, Mongoose, JWT |
| [Backend/src/emails](Backend/src/emails/) | Confirmación de cuenta y recuperación | Resend |

## Desarrollo local

Necesitas Node.js 22, npm, una base MongoDB y configuración de correo para probar los flujos de cuenta. Los dos paquetes requieren Node `>=22.13.0 <23`.

1. Instala las dependencias de cada aplicación:

   ```sh
   cd Backend
   npm ci
   cd ../FrontEnd
   npm ci
   ```

2. Copia `Backend/.env.example` a `Backend/.env` y reemplaza sus valores ficticios:

   | Variable | Uso |
   | --- | --- |
   | `DATABASE_URL` | Conexión a MongoDB |
   | `JWT_SECRET` | Secreto privado para firmar tokens |
   | `FRONTEND_URL` | Origen de la web, por ejemplo `http://localhost:5173` |
   | `CORS_ORIGINS` | Orígenes adicionales permitidos, separados por comas |
   | `API_PUBLIC_URL` | URL base publicada en Swagger; localmente `http://localhost:4000` |
   | `PORT` | Puerto de la API; por defecto 4000 |
   | `RESEND_API_KEY` | Credencial de Resend para los correos de autenticación |

   El remitente de correo está definido en `Backend/src/emails/AuthEmail.ts`; debe estar autorizado en tu cuenta de Resend. También existe configuración SMTP en el código, pero el flujo de correo de autenticación actual utiliza Resend.

3. Copia `FrontEnd/.env.example` a `FrontEnd/.env.local`. La URL debe incluir `/api`:

   ```dotenv
   VITE_API_URL=http://localhost:4000/api
   ```

4. Ejecuta `npm run dev` en dos terminales: una dentro de `Backend` y otra dentro de `FrontEnd`.

La API expone `/api/auth`, `/api/reptiles`, `/api-docs` y `/api-docs.json`. La dirección del frontend aparece en la salida de Vite.

## Despliegue objetivo

La preparación para Cloudflare Pages y Railway, las variables requeridas, los registros DNS pendientes, el plan de rollback y el checklist de producción están en [docs/deployment.md](docs/deployment.md).

- Frontend: `https://reptileapp.ian-k.dev`
- Backend: `https://api-reptileapp.ian-k.dev`
- Base de datos: MongoDB Atlas existente
- Correo: Resend existente

## Comandos disponibles

| Carpeta | Comando | Acción |
| --- | --- | --- |
| Backend | `npm run build` | Compila TypeScript |
| Backend | `npm start` | Ejecuta el backend compilado |
| FrontEnd | `npm run lint` | Revisa el código |
| FrontEnd | `npm run build` | Comprueba tipos y genera la web |
| FrontEnd | `npm run preview` | Sirve el build local |

No hay un script de pruebas automatizadas declarado en ninguno de los dos paquetes. Los comandos anteriores describen el repositorio; no representan una certificación de producción.

## Sobre el proyecto

Desarrollado por [Ian K.](https://github.com/ian0000) como proyecto personal. Usa valores locales de configuración y conserva las credenciales fuera del repositorio.
