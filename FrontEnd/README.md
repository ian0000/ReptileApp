# ReptileApp — frontend

Interfaz React 19, Vite y TypeScript para registrar reptiles y sus comidas, pesajes y notas. React Router gestiona la navegación, React Query la caché de servidor, React Hook Form los formularios y Zod las formas de datos del cliente. La API Express es un paquete separado en `../Backend`.

## Entorno local

Se requiere Node **22**, dentro del rango `>=22.13.0 <23`, y npm. No usar el Node 24 de otros proyectos.

Desde esta carpeta, en PowerShell:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Si `.env.local` ya existe, conservarlo y revisarlo en lugar de sobrescribirlo. El cliente requiere una URL de API con `/api` exactamente una vez:

```dotenv
VITE_API_URL=http://localhost:4000/api
```

Las variables `VITE_*` se incorporan al bundle público; nunca contienen credenciales o secretos. Para probar flujos de cuenta o CRUD hace falta un backend local/de pruebas y una cuenta autorizada. No apuntar pruebas de escritura a producción. Vite imprime la URL y el puerto efectivos en la terminal.

La landing `/bienvenida` puede observarse sin autenticarse; su demo no consulta registros de producción. Las pantallas privadas conservan la autenticación existente.

## Comandos existentes

| Comando | Función |
| --- | --- |
| `npm ci` | Instala las versiones de `package-lock.json` |
| `npm run dev` | Inicia Vite |
| `npm run lint` | Ejecuta ESLint |
| `npm run test:contracts` | Pruebas de autenticación, reptiles, mutaciones y feedback con Axios simulado, sin red |
| `npm run build` | Ejecuta `tsc -b` y genera `dist` con Vite |
| `npm run preview` | Sirve el build local, después de `build` |

No hay scripts `test`, `typecheck` o e2e declarados. `test:contracts` es el script específico añadido para la regresión de errores/autenticación. El chequeo de TypeScript forma parte de `build`; no se deben inventar comandos ni presentar revisión manual como pruebas automatizadas.

Las pruebas de contrato usan `node:test` y un loader local que transpila los módulos de `src` con TypeScript ya declarado. El único reemplazo de entorno es la URL Vite, fijada a un dominio `.invalid`. Un adaptador Axios intercepta todas las llamadas: se verifican rechazos de red, mensajes de backend, status 401, respuestas de usuario inválidas, token de login, headers, métodos/rutas/payloads, extracción segura del texto de éxito de mutaciones y errores de los cinco wrappers de reptiles y de las nueve mutaciones de historiales. También comprueban que una fecha de nacimiento vacía se omite del JSON y se conservan los valores de género y fechas suministradas. No se conectan al backend ni envían correos, y no prueban autorización real del servidor.

## Pantallas y rutas

| Ruta | Acceso | Propósito |
| --- | --- | --- |
| `/bienvenida` | Público | Presentación y demostración rotulada del producto |
| `/auth/login` | Público | Inicio de sesión |
| `/auth/register` | Público | Registro |
| `/auth/confirm-account` | Público | Confirmación de cuenta |
| `/auth/request-code` | Público | Solicitud de nuevo código |
| `/auth/forgot-password` | Público | Solicitud de recuperación |
| `/auth/new-password` | Público | Validación del código y nueva contraseña |
| `/` | Autenticado | Mis reptiles |
| `/reptiles/nuevo` | Autenticado | Alta de ejemplar |
| `/reptiles/:id` | Autenticado | Detalle |
| `/reptiles/:id/editar` | Autenticado | Edición |
| `/reptiles/:id/comidas` | Autenticado | Historial y registro de comidas |
| `/reptiles/:id/pesajes` | Autenticado | Historial y registro de pesajes |
| `/reptiles/:id/notas` | Autenticado | Historial y registro de notas |
| `/404` | Según layout existente | Estado de página no encontrada |

La autorización efectiva sigue perteneciendo a la API. No existen roles administrativos incorporados por el rediseño. Los identificadores de ruta y los contratos existentes se conservan.

## Organización

```text
src/
  api/             Clientes, esquemas y tipos de contratos
  hooks/           Consultas y mutaciones existentes
  design-system/   Tokens, enlaces, campos, feedback y Dialog
  layout/          Shell autenticado y layout de acceso
  views/           Rutas públicas y módulos de aplicación
  component/       Formularios, registros y componentes de módulos
```

El sistema de diseño se aplica dentro de `.reptile-design`. `components.tsx` exporta `ActionLink`, `BrandMark` y `SectionHeading`; `forms.tsx` exporta `FormField`, `SubmitButton` y `FormNotice`. `Dialog.tsx` utiliza Headless UI ya instalado para foco, Escape y semántica de diálogo. Los consumidores siguen siendo responsables de IDs, asociaciones de error, contenido y permisos.

Jost se sirve localmente desde `public/fonts`, junto a su licencia OFL. La ilustración de marca está separada de los datos de las cuentas. La demo de `/bienvenida` contiene ejemplos sintéticos y no promete recordatorios, puntuaciones de salud ni otras funciones inexistentes.

## QA y límites

El estado actual de tickets y validaciones se registra en [FRONTEND_REFACTOR.md](../docs/FRONTEND_REFACTOR.md). Los gates deben complementarse con navegación, teclado, reflow, errores, pending, confirmaciones y los workflows afectados usando datos de prueba.

Las capturas y los datos sintéticos permiten revisar presentación y estados, pero no acreditan una conexión real con MongoDB/Resend, pruebas destructivas de producción, dispositivos físicos, lectores de pantalla o cumplimiento WCAG completo. El usuario autorizó publicar la versión validada a través de main; la verificación del commit desplegado permanece separada de los resultados locales.

La configuración operativa vigente está en [deployment.md](../docs/deployment.md). No cambiar infraestructura, contratos, JWT, ownership o reglas del backend como parte de un ajuste visual.
