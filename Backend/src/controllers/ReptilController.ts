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
      await reptil.save();
      res.send("Reptil creado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getAllReptiles = async (req: Request, res: Response) => {
    try {
      const reptiles = await Reptil.find();
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
      }
      res.json(reptil);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
