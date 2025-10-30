import { Router } from "express";
import { handleInputErrors } from "../middleware/validation";
import { ReptilController } from "../controllers/ReptilController";
import { body, param } from "express-validator";
import { NoteController } from "../controllers/NoteController";
import { tags, tipo } from "../utils/Common";
import { reptileExist } from "../middleware/Reptil";
import { noteBelongsToReptil, noteExist } from "../middleware/Note";

const router = Router();

// #region Reptil
router.post(
  "/create-reptil",
  body("name").notEmpty().withMessage("El nombre del reptil es obligatorio."),
  body("birthday")
    .optional()
    .isDate()
    .withMessage("La fecha de nacimiento debe ser tipo fecha 'yyyy-MM-dddd.'"),
  body("description").optional(),
  body("genre").optional(),
  handleInputErrors,
  ReptilController.createReptil
);

router.get("/", ReptilController.getAllReptiles);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  ReptilController.getReptileById
);

router.param("reptileID", reptileExist);
router.patch(
  "/update-reptil/:reptileID",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío."),
  body("birthDate")
    .optional()
    .isDate()
    .withMessage("La fecha de nacimiento debe ser tipo fecha 'yyyy-MM-dddd.'"),
  body("description").optional(),
  body("genre").optional(),
  handleInputErrors,
  ReptilController.updateReptil
);
//#endregion
//#region Notas
router.param("noteID", noteExist);
router.param("noteID", noteBelongsToReptil);

router.get("/:reptileID/notes", NoteController.getAllNotes);
router.get("/:reptileID/notes/:noteID", NoteController.getNoteByID);
router.post(
  "/:reptileID/notes",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  body(["name", "description"]).trim().notEmpty().withMessage("El campo no puede estar vacio."),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger un tipo.")
    .isIn(Object.values(tipo))
    .withMessage(`El tipo debe ser uno de: ${Object.values(tipo).join(", ")}`),

  body("tags")
    .optional()
    .isIn(Object.values(tags))
    .withMessage(`El tag debe ser uno de: ${Object.values(tags).join(", ")}`),

  body("weight").optional().isFloat({ min: 0 }).withMessage("El peso debe ser un número positivo."),

  body("humidity")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("La humedad debe ser un porcentaje entre 0 y 100."),

  body("temp")
    .optional()
    .isFloat({ min: 0, max: 60 })
    .withMessage("La temperatura debe ser un número entre 0 y 60°C."),

  handleInputErrors,
  NoteController.createNote
);
router.delete(
  "/:reptileID/notes/:noteID",
  param("noteID").isMongoId().withMessage("Id no valido"),
  NoteController.deleteNote
);

//#endregion
export default router;
