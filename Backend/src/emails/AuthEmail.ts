import { Resend } from "resend";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const info = await resend.emails.send({
      from: "ReptilApp 🦎 <onboarding@ian-k.dev>",
      to: user.email,
      subject: "🦎 Confirma tu cuenta en ReptilApp",
      html: `
  <div style="font-family: Arial, sans-serif; background-color:#f3f4f6; padding:40px 0;">
    <table align="center" width="100%" style="max-width:600px; background:white; border-radius:12px; padding:40px; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      
      <tr>
        <td align="center">
          <h1 style="margin:0; font-size:26px; color:#111827;">
            🦎 ReptilApp
          </h1>
          <p style="margin-top:8px; font-size:14px; color:#6b7280;">
            Gestiona y cuida a tus reptiles fácilmente
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px;">
          <p style="font-size:16px; color:#374151;">
            Hola <strong>${user.name}</strong>,
          </p>

          <p style="font-size:16px; color:#374151; line-height:1.6;">
            Gracias por crear tu cuenta en <strong>ReptilApp</strong>. 
            Solo falta un paso más para activarla.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:30px 0;">
          <a 
            href="${process.env.FRONTEND_URL}/auth/confirm-account"
            style="
              display:inline-block;
              background: linear-gradient(90deg, #10b981, #0ea5e9);
              color:white;
              padding:14px 28px;
              text-decoration:none;
              border-radius:10px;
              font-weight:bold;
              font-size:16px;
            "
          >
            Confirmar mi cuenta
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <p style="font-size:14px; color:#6b7280;">
            O si lo prefieres, ingresa este código manualmente:
          </p>

          <div style="
            text-align:center;
            font-size:22px;
            font-weight:bold;
            letter-spacing:4px;
            padding:12px;
            background:#f9fafb;
            border-radius:8px;
            margin:15px 0;
            color:#111827;
          ">
            ${user.token}
          </div>

          <p style="font-size:13px; color:#9ca3af;">
            Este código expirará en 10 minutos.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px;">
          <p style="font-size:13px; color:#9ca3af;">
            Si no creaste esta cuenta, puedes ignorar este mensaje.
          </p>
        </td>
      </tr>

    </table>
  </div>
  `,
    });

    console.log("Mensaje enviado", info);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const info = await resend.emails.send({
      from: "ReptilApp 🦎 <onboarding@resend.dev>",
      to: user.email,
      subject: "🔐 Restablece tu contraseña en ReptilApp",
      html: `
  <div style="font-family: Arial, sans-serif; background-color:#f3f4f6; padding:40px 0;">
    <table align="center" width="100%" style="max-width:600px; background:white; border-radius:12px; padding:40px; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      
      <tr>
        <td align="center">
          <h1 style="margin:0; font-size:26px; color:#111827;">
            🔐 ReptilApp
          </h1>
          <p style="margin-top:8px; font-size:14px; color:#6b7280;">
            Seguridad de tu cuenta
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px;">
          <p style="font-size:16px; color:#374151;">
            Hola <strong>${user.name}</strong>,
          </p>

          <p style="font-size:16px; color:#374151; line-height:1.6;">
            Recibimos una solicitud para restablecer tu contraseña.
            Puedes hacerlo usando el botón a continuación.
          </p>
        </td>
      </tr>

      <tr>
        <td align="center" style="padding:30px 0;">
          <a 
            href="${process.env.FRONTEND_URL}/auth/new-password"
            style="
              display:inline-block;
              background: linear-gradient(90deg, #10b981, #0ea5e9);
              color:white;
              padding:14px 28px;
              text-decoration:none;
              border-radius:10px;
              font-weight:bold;
              font-size:16px;
            "
          >
            Restablecer contraseña
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <p style="font-size:14px; color:#6b7280;">
            O si prefieres, usa este código manual:
          </p>

          <div style="
            text-align:center;
            font-size:22px;
            font-weight:bold;
            letter-spacing:4px;
            padding:12px;
            background:#f9fafb;
            border-radius:8px;
            margin:15px 0;
            color:#111827;
          ">
            ${user.token}
          </div>

          <p style="font-size:13px; color:#9ca3af;">
            Este código expirará en 10 minutos.
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding-top:30px;">
          <p style="font-size:13px; color:#9ca3af;">
            Si no solicitaste este cambio, puedes ignorar este mensaje.
            Tu contraseña seguirá siendo la misma.
          </p>
        </td>
      </tr>

    </table>
  </div>
  `,
    });

    console.log("Mensaje enviado", info);
  };
}
