import { NextFunction, Request, Response } from "express";
import LogComidas, { ILogComidas } from "../models/LogComidas";

declare global {
  namespace Express {
    interface Request {
      logComida: ILogComidas;
    }
  }
}

export async function logComidaExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { logComidaID } = req.params;
    const log = await LogComidas.findById(logComidaID);
    if (!log) {
      const error = new Error("Log no encontrada");
      res.status(404).json({ error: error.message });
      return;
    }
    req.logComida = log;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export async function logComidaBelongsToReptil(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.logComida.reptil.toString() != req.reptil.id.toString()) {
      const error = new Error("Accion no valida");
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
