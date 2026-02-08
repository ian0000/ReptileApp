import { Request, Response } from "express";
import LogComidas, { ILogComidas } from "../models/LogComidas";

export class LogComidaController {
  static createLog = async (req: Request<{}, {}, ILogComidas, {}>, res: Response) => {
    const log = new LogComidas({ ...req.body, reptil: req.reptil._id, createdBy: req.user.id });
    req.reptil.logComida.push(log.id);
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
      const log = await LogComidas.find({ reptil: req.reptil.id }).populate("reptil");
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getLogById = async (req: Request, res: Response) => {
    try {
      const log = await LogComidas.findById(req.logComida.id).populate({
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
      req.reptil.logComida = req.reptil.logComida.filter((x) => {
        return x._id.toString() !== req.logComida.id.toString();
      });

      await Promise.all([req.logComida.deleteOne(), req.reptil.save()]);
      res.status(201).json({ message: "Log eliminado correctamente" });
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateLog = async (req: Request, res: Response) => {
    try {
      Object.assign(req.logComida, req.body);
      await req.logComida.save();
      res.status(201).json({ message: "Log Actualizado", LogComidas: req.logComida });
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
