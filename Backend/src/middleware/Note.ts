import { NextFunction, Request, Response } from "express";
import Nota, { INota } from "../models/Nota";

declare global {
  namespace Express {
    interface Request {
      nota: INota;
    }
  }
}

export async function noteExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { noteID } = req.params;
    const note = await Nota.findById(noteID);
    if (!note) {
      const error = new Error("Nota no encontrada");
      res.status(404).json({ error: error });
      return;
    }
    req.nota = note;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}

export async function noteBelongsToReptil(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.nota.reptil.toString() != req.reptil.id.toString()) {
      const error = new Error("Accion no valida");
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
