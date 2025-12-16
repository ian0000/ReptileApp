import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import morgan from "morgan";

import reptileRouter from "./routes/reptileRouter";

dotenv.config();
connectDB();

const app = express();

app.use(cors(corsConfig));

// loggin
app.use(morgan("dev"));

app.use(express.json());

app.use("/api/reptiles", reptileRouter);
//Routes

export default app;
