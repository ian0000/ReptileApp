import { NextFunction, Request, Response } from "express";
import Reptil, { IReptil } from "../models/Reptil";
declare global {
  namespace Express {
    interface Request {
      reptil: IReptil;
    }
  }
}

export async function reptileExist(req: Request, res: Response, next: NextFunction) {
  try {
    const { reptileID } = req.params;
    const reptile = await Reptil.findById(reptileID);

    if (!reptile) {
      const error = new Error("Reptil no encontrado");
      res.status(404).json({ error: error });
      return;
    }
    req.reptil = reptile;
    next();
  } catch (error) {
    res.status(500).json({ error: "Hubo un error" });
  }
}
