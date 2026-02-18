import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = () => {
  return {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: false, // importante para 2525
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
};

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
});

// export const transporter = nodemailer.createTransport(config());
