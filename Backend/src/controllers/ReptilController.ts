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
      }).populate("owner", "name email");
      res.json(reptiles);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getReptileById = async (req: Request, res: Response) => {
    try {
      var { id } = req.params;
      const reptil = await Reptil.findById(id).populate("owner", "name email");
      if (!reptil) {
        const error = new Error("Reptil no encontrado");
        res.status(404).json({
          error: error.message,
        });
        return;
      }

      res.json(reptil);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateReptil = async (req: Request, res: Response) => {
    try {
      const { id: reptileID } = req.params;
      const { name } = req.body;

      // 🔐 Validar owner (porque es update por ID)
      const ownerId =
        typeof req.reptil.owner === "object" ? req.reptil.owner._id : req.reptil.owner;
      if (req.user._id.toString() !== ownerId.toString()) {
        return res.status(403).json({ error: "Acción no válida" });
      }

      if (name && name !== req.reptil.name) {
        const nameInUse = await Reptil.findOne({
          name,
          owner: req.user._id,
          _id: { $ne: reptileID },
        });

        if (nameInUse) {
          return res.status(409).json({
            error: "Ya estás usando ese nombre de reptil",
          });
        }
      }

      // ✏️ Actualizar solo campos enviados
      Object.assign(req.reptil, req.body);
      await req.reptil.save();

      return res.json({
        message: "Reptil actualizado correctamente",
        reptil: req.reptil,
      });
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error interno",
      });
    }
  };

  static deleteReptil = async (req: Request, res: Response) => {
    try {
      const ownerId =
        typeof req.reptil.owner === "object" ? req.reptil.owner._id : req.reptil.owner;

      if (req.user._id.toString() !== ownerId.toString()) {
        return res.status(403).json({
          error: "Acción no válida",
        });
      }

      await req.reptil.deleteOne();

      return res.json({
        message: "Reptil eliminado correctamente",
      });
    } catch (error) {
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Error interno",
      });
    }
  };
}
