import { Request, Response } from "express";
import Nota from "../models/Nota";

export class NoteController {
  static createNote = async (req: Request, res: Response) => {
    try {
      const {} = req.body;
      const note = new Nota(req.body);
      await note.save();
      res.send("Nota creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error " });
    }
  };
}
