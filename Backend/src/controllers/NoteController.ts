import { Request, Response } from "express";
import Nota, { INota } from "../models/Nota";

export class NoteController {
  static createNote = async (req: Request<{}, {}, INota, {}>, res: Response) => {
    const note = new Nota({ ...req.body, reptil: req.reptil._id });
    req.reptil.notas.push(note.id);
    try {
      await Promise.all([req.reptil.save(), note.save()]);
      res.status(201).json({ message: "Nota creada correctamente", note });
      return;
    } catch (error) {
      res.status(500).json({ error: "Hubo un error " });
    }
  };

  static getAllNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Nota.find({ reptil: req.reptil.id }).populate("reptil");
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getNoteByID = async (req: Request, res: Response) => {
    try {
      const note = await Nota.findById(req.nota.id).populate({
        path: "reptil",
        select: "id name",
      });
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static deleteNote = async (req: Request, res: Response) => {
    try {
      req.reptil.notas = req.reptil.notas.filter((x) => {
        return x._id.toString() !== req.nota.id.toString();
      });

      await Promise.all([req.nota.deleteOne(), req.reptil.save()]);
      res.send("Eliminada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
