import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import reptileRouter from "./routes/reptileRouter";
import authRouter from "./routes/authRouter";
import { swaggerDocument } from "./swagger";

dotenv.config();
connectDB();

const app = express();

// loggin
app.use(morgan("dev"));

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});
app.use(cors(corsConfig));

app.use("/api/auth", authRouter);
app.use("/api/reptiles", reptileRouter);
//Routes

export default app;
