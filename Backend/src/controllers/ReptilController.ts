import { Request, Response } from "express";
import Reptil from "../models/Reptil";

export class ReptilController {
  static createReptil = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const reptileExist = await Reptil.findOne({ name });
      if (reptileExist) {
        const error = new Error("Ya esta usando ese nombre de reptil");
        res.status(409).json({ error: error.message });
        return;
      }

      // crea reptil
      const reptil = new Reptil(req.body);
      reptil.owner = req.user.id;
      await reptil.save();
      res.send("Reptil creado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getAllReptiles = async (req: Request, res: Response) => {
    try {
      const reptiles = await Reptil.find({
        $or: [{ owner: { $in: req.user.id } }],
      });
      res.json(reptiles);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getReptileById = async (req: Request, res: Response) => {
    try {
      var { id } = req.params;
      const reptil = await Reptil.findById(id);
      if (!reptil) {
        const error = new Error("Reptil no encontrado");
        res.status(404).json({
          error: error.message,
        });
        return;
      }
      if (reptil.owner.toString() !== req.user.id.toString()) {
        const error = new Error("Accion no valida");
        res.status(404).json({ error: error.message });
      }
      res.json(reptil);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateReptil = async (req: Request, res: Response) => {
    try {
      var { reptileID } = req.params;

      const { name } = req.body;
      const reptileExist = await Reptil.findOne({ name });
      if (reptileExist && reptileExist.id != reptileID) {
        const error = new Error("Ya esta usando ese nombre de reptil");
        res.status(409).json({ error: error.message });
        return;
      }

      // Actualizar solo los campos enviados
      Object.assign(req.reptil, req.body);
      await req.reptil.save();

      res.json({ message: "Reptil actualizado correctamente", reptil: req.reptil });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static deleteReptil = async (req: Request, res: Response) => {
    try {
      await req.reptil.deleteOne();
      res.json({ message: "Reptil eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
