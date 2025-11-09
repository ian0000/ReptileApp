import { Request, Response } from "express";
import LogPesaje, { ILogPesaje } from "../models/LogPesaje";

export class LogPesajeController {
  static createLog = async (req: Request<{}, {}, ILogPesaje, {}>, res: Response) => {
    const log = new LogPesaje({ ...req.body, reptil: req.reptil._id });
    req.reptil.logPesaje.push(log.id);
    try {
      await Promise.all([req.reptil.save(), log.save()]);
      res.status(201).json({ message: "Log creado correctamente", log });
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getLogs = async (req: Request, res: Response) => {
    try {
      const log = await LogPesaje.find({ reptil: req.reptil.id }).populate("reptil");
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getLogById = async (req: Request, res: Response) => {
    try {
      const log = await LogPesaje.findById(req.logPesaje.id).populate({
        path: "reptil",
        select: "id name",
      });
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static deleteLog = async (req: Request, res: Response) => {
    try {
      req.reptil.logPesaje = req.reptil.logPesaje.filter((x) => {
        return x._id.toString() !== req.logPesaje.id.toString();
      });

      await Promise.all([req.logPesaje.deleteOne(), req.reptil.save()]);
      res.status(201).json({ message: "Log eliminado correctamente" });
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateLog = async (req: Request, res: Response) => {
    try {
      Object.assign(req.logPesaje, req.body);
      await req.logPesaje.save();
      res.status(201).json({ message: "Log Actualizado", LogPesaje: req.logPesaje });
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" + error });
    }
  };
}
