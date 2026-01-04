import { Router } from "express";
import { handleInputErrors } from "../middleware/validation";
import { ReptilController } from "../controllers/ReptilController";
import { body, param } from "express-validator";
import { NoteController } from "../controllers/NoteController";
import {
  ContextoPesaje,
  metodoAlimentacion,
  tags,
  tipo,
  tipoAlimento,
  unidad,
} from "../utils/Common";
import { reptileExist } from "../middleware/Reptil";
import { noteBelongsToReptil, noteExist } from "../middleware/Note";
import { logPesajeBelongsToReptil, logPesajeExist } from "../middleware/LogPesaje";
import { logComidaBelongsToReptil, logComidaExist } from "../middleware/LogComidas";
import { LogPesajeController } from "../controllers/LogPesajeController";
import { LogComidaController } from "../controllers/LogComidaController";

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

router.delete(
  "/delete-reptil/:reptileID",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  ReptilController.deleteReptil
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
  handleInputErrors,
  NoteController.deleteNote
);
router.patch(
  "/:reptileID/notes/:noteID",
  param("noteID").isMongoId().withMessage("Id no valido"),
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
  NoteController.updateNote
);

//#endregion
//#region Log Pesaje
router.param("logPesajeID", logPesajeExist);
router.param("logPesajeID", logPesajeBelongsToReptil);

router.get("/:reptileID/logPesaje", LogPesajeController.getLogs);
router.get("/:reptileID/logPesaje/:logPesajeID", LogPesajeController.getLogById);
router.post(
  "/:reptileID/logPesaje",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  body("peso").isFloat({ min: 0 }).withMessage("El peso debe ser un número positivo."),
  body(["observaciones"])
    .trim()
    .notEmpty()
    .withMessage("El campo no puede estar vacio.")
    .isLength({ max: 300 })
    .withMessage("Las observaciones no deben exceder 300 caracteres."),
  body("unidad")
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger una unidad.")
    .isIn(Object.values(unidad))
    .withMessage(`La unidad debe ser uno de: ${Object.values(unidad).join(", ")}`),
  body("contexto")
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger un contexto.")
    .isIn(Object.values(ContextoPesaje))
    .withMessage(`El  contexto debe ser uno de: ${Object.values(ContextoPesaje).join(", ")}`),
  handleInputErrors,
  LogPesajeController.createLog
);
router.delete(
  "/:reptileID/logPesaje/:logPesajeID",
  param("logPesajeID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  LogPesajeController.deleteLog
);

router.patch(
  "/:reptileID/logPesaje/:logPesajeID",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  body("peso").optional().isFloat({ min: 0 }).withMessage("El peso debe ser un número positivo."),
  body(["observaciones"])
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El campo no puede estar vacio.")
    .isLength({ max: 300 })
    .withMessage("Las observaciones no deben exceder 300 caracteres."),
  body("unidad")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger una unidad.")
    .isIn(Object.values(unidad))
    .withMessage(`La unidad debe ser uno de: ${Object.values(unidad).join(", ")}`),
  body("contexto")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger un contexto.")
    .isIn(Object.values(ContextoPesaje))
    .withMessage(`El  contexto debe ser uno de: ${Object.values(ContextoPesaje).join(", ")}`),

  handleInputErrors,
  LogPesajeController.updateLog
);
//#endregion
//#region Log Comidas
router.param("logComidaID", logComidaExist);
router.param("logComidaID", logComidaBelongsToReptil);

router.get("/:reptileID/logComidas", LogComidaController.getLogs);
router.get("/:reptileID/logComidas/:logComidaID", LogComidaController.getLogById);

router.post(
  "/:reptileID/logComidas",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  body(["cantidad", "apetito"]).isFloat({ min: 0 }).withMessage("Debe ser un número positivo."),
  body(["excreto"]).isBoolean().withMessage("Debe escogerse una opcion."),
  body(["suplemento", "observaciones"])
    .trim()
    .notEmpty()
    .withMessage("El campo no puede estar vacio.")
    .isLength({ max: 300 }),
  body("unidad")
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger una unidad.")
    .isIn(Object.values(unidad))
    .withMessage(`La unidad debe ser uno de: ${Object.values(unidad).join(", ")}`),
  body("tipoAlimento")
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger un tipo de alimento.")
    .isIn(Object.values(tipoAlimento))
    .withMessage(`El  tipo de alimento debe ser uno de: ${Object.values(tipoAlimento).join(", ")}`),
  body("metodo")
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger un metodo de alimento.")
    .isIn(Object.values(metodoAlimentacion))
    .withMessage(
      `El  metodo de alimento debe ser uno de: ${Object.values(metodoAlimentacion).join(", ")}`
    ),
  handleInputErrors,
  LogComidaController.createLog
);
router.delete(
  "/:reptileID/logComidas/:logComidaID",
  param("logComidaID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  LogComidaController.deleteLog
);
router.patch(
  "/:reptileID/logComidas/:logComidaID",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  body(["cantidad", "apetito"])
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Debe ser un número positivo."),
  body(["excretó"]).optional().isBoolean().withMessage("Debe escogerse una opcion."),
  body(["suplemento", "observaciones"])
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El campo no puede estar vacio.")
    .isLength({ max: 300 }),
  body("unidad")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger una unidad.")
    .isIn(Object.values(unidad))
    .withMessage(`La unidad debe ser uno de: ${Object.values(unidad).join(", ")}`),
  body("tipoAlimento")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger un tipo de alimento.")
    .isIn(Object.values(tipoAlimento))
    .withMessage(`El  tipo de alimento debe ser uno de: ${Object.values(tipoAlimento).join(", ")}`),
  body("metodo")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Se debe escoger un metodo de alimento.")
    .isIn(Object.values(metodoAlimentacion))
    .withMessage(
      `El  metodo de alimento debe ser uno de: ${Object.values(metodoAlimentacion).join(", ")}`
    ),
  handleInputErrors,
  LogComidaController.updateLog
);
//#endregion
export default router;
