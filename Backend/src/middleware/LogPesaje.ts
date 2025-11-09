import { NextFunction, Request, Response } from "express";
import LogPesaje, { ILogPesaje } from "../models/LogPesaje";

declare global {
  namespace Express {
    interface Request {
      logPesaje: ILogPesaje;
    }
  }
}

export async function logPesajeExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { logPesajeID } = req.params;
    const log = await LogPesaje.findById(logPesajeID);
    if (!log) {
      const error = new Error("Log no encontrada");
      return res.status(404).json({ error: error.message });
    }
    req.logPesaje = log;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export async function logPesajeBelongsToReptil(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.logPesaje.reptil.toString() != req.reptil.id.toString()) {
      const error = new Error("Accion no valida");
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
