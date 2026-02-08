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
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: number
 *       enum: [1, 2, 3]
 *       description: |
 *         1 = Macho
 *         2 = Hembra
 *         3 = Desconocido
 *
 *     TipoNota:
 *       type: string
 *       enum: [comida, suplemento, comportamiento, otro]
 *
 *     TagsNota:
 *       type: string
 *       enum:
 *         - calcio
 *         - multivitaminico
 *         - muda
 *         - comportamiento normal
 *         - fruta
 *
 *     Unidad:
 *       type: string
 *       enum: [g, kg, ml, unidad]
 *
 *     TipoAlimento:
 *       type: string
 *       enum:
 *         - grillo
 *         - gusano de harina
 *         - gusano de coco
 *         - gusano rey
 *         - cucaracha dubia
 *         - cucaracha roja
 *         - ratón pinky
 *         - ratón adulto
 *         - otro
 *
 *     MetodoAlimentacion:
 *       type: string
 *       enum: [manual, pinzas, libre, forzada, otro]
 *
 *     ContextoPesaje:
 *       type: string
 *       enum:
 *         - Control rutinario
 *         - Post muda
 *         - Pre cría
 *         - Post cría
 *         - Revisión por enfermedad
 *         - Cambio de dieta
 *         - Nuevo ejemplar
 *         - Otro
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reptil:
 *       type: object
 *       required:
 *         - name
 *         - genre
 *       properties:
 *         _id:
 *           type: string
 *           example: 65a1bc23ff12a9c33b0e9999
 *         name:
 *           type: string
 *           example: Iguana Verde
 *         birthDate:
 *           type: string
 *           format: date
 *           example: 2022-03-15
 *         description:
 *           type: string
 *           example: Reptil arbóreo
 *         genre:
 *           $ref: '#/components/schemas/Genre'
 *         notas:
 *           type: array
 *           items:
 *             type: string
 *         logPesaje:
 *           type: array
 *           items:
 *             type: string
 *         logComida:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// #region Reptil
/**
 * @swagger
 * /api/reptiles/create-reptil:
 *   post:
 *     summary: Crear un reptil
 *     tags: [Reptiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reptil'
 *     responses:
 *       200:
 *         description: Reptil creado correctamente
 *       409:
 *         description: Ya existe un reptil con ese nombre
 *       400:
 *         description: Error de validación
 */

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
  ReptilController.createReptil,
);

/**
 * @swagger
 * /api/reptiles:
 *   get:
 *     summary: Obtener todos los reptiles
 *     tags: [Reptiles]
 *     responses:
 *       200:
 *         description: Lista de reptiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reptil'
 */
router.get("/", ReptilController.getAllReptiles);

/**
 * @swagger
 * /api/reptiles/{id}:
 *   get:
 *     summary: Obtener un reptil por ID
 *     tags: [Reptiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reptil encontrado
 *       404:
 *         description: Reptil no encontrado
 */
router.get(
  "/:id",
  param("id").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  ReptilController.getReptileById,
);

router.param("reptileID", reptileExist);
/**
 * @swagger
 * /api/reptiles/update-reptil/{reptileID}:
 *   patch:
 *     summary: Actualizar un reptil
 *     tags: [Reptiles]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reptil'
 *     responses:
 *       200:
 *         description: Reptil actualizado correctamente
 *       409:
 *         description: Nombre duplicado
 */
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
  ReptilController.updateReptil,
);

/**
 * @swagger
 * /api/reptiles/delete-reptil/{reptileID}:
 *   delete:
 *     summary: Eliminar un reptil
 *     tags: [Reptiles]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reptil eliminado correctamente
 */
router.delete(
  "/delete-reptil/:reptileID",
  param("reptileID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  ReptilController.deleteReptil,
);
//#endregion Reptil

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - reptil
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           example: Revisión veterinaria
 *         description:
 *           type: string
 *           example: Chequeo general
 *         type:
 *           $ref: '#/components/schemas/TipoNota'
 *         tags:
 *           $ref: '#/components/schemas/TagsNota'
 *         weight:
 *           type: number
 *           example: 1.3
 *         humidity:
 *           type: number
 *           example: 70
 *         temp:
 *           type: number
 *           example: 28
 *         reptil:
 *           type: string
 *           description: ID del reptil
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

//#region Notas
router.param("noteID", noteExist);
router.param("noteID", noteBelongsToReptil);
/**
 * @swagger
 * /api/reptiles/{reptileID}/notes:
 *   get:
 *     summary: Obtener todas las notas de un reptil
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de notas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       404:
 *         description: Reptil no encontrado
 */
router.get("/:reptileID/notes", NoteController.getAllNotes);

/**
 * @swagger
 * /api/reptiles/{reptileID}/notes/{noteID}:
 *   get:
 *     summary: Obtener una nota por ID
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Nota no encontrada
 */
router.get("/:reptileID/notes/:noteID", NoteController.getNoteByID);

/**
 * @swagger
 * /api/reptiles/{reptileID}/notes:
 *   post:
 *     summary: Crear una nota para un reptil
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: Nota creada correctamente
 *       400:
 *         description: Error de validación
 */
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
  NoteController.createNote,
);

/**
 * @swagger
 * /api/reptiles/{reptileID}/notes/{noteID}:
 *   delete:
 *     summary: Eliminar una nota
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nota eliminada correctamente
 */
router.delete(
  "/:reptileID/notes/:noteID",
  param("noteID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  NoteController.deleteNote,
);

/**
 * @swagger
 * /api/reptiles/{reptileID}/notes/{noteID}:
 *   patch:
 *     summary: Actualizar una nota
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: noteID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: Nota actualizada correctamente
 *       404:
 *         description: Nota no encontrada
 */
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
  NoteController.updateNote,
);

//#endregion Notas
/**
 * @swagger
 * components:
 *   schemas:
 *     LogPesaje:
 *       type: object
 *       required:
 *         - peso
 *         - reptil
 *       properties:
 *         _id:
 *           type: string
 *         peso:
 *           type: number
 *           minimum: 0
 *           example: 1.45
 *         unidad:
 *           $ref: '#/components/schemas/Unidad'
 *         contexto:
 *           $ref: '#/components/schemas/ContextoPesaje'
 *         observaciones:
 *           type: string
 *           example: Peso tomado en ayuno
 *         diferencia:
 *           type: number
 *           example: 0.05
 *         reptil:
 *           type: string
 *           description: ID del reptil
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

//#region Log Pesaje
router.param("logPesajeID", logPesajeExist);
router.param("logPesajeID", logPesajeBelongsToReptil);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logPesaje:
 *   get:
 *     summary: Obtener logs de pesaje de un reptil
 *     tags: [LogPesaje]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de registros de pesaje
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LogPesaje'
 *       404:
 *         description: Reptil no encontrado
 */

router.get("/:reptileID/logPesaje", LogPesajeController.getLogs);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logPesaje/{logPesajeID}:
 *   get:
 *     summary: Obtener un log de pesaje por ID
 *     tags: [LogPesaje]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: logPesajeID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro de pesaje encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogPesaje'
 *       404:
 *         description: Registro no encontrado
 */

router.get("/:reptileID/logPesaje/:logPesajeID", LogPesajeController.getLogById);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logPesaje:
 *   post:
 *     summary: Crear un registro de pesaje
 *     tags: [LogPesaje]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogPesaje'
 *     responses:
 *       200:
 *         description: Registro de pesaje creado correctamente
 *       400:
 *         description: Error de validación
 */

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
  LogPesajeController.createLog,
);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logPesaje/{logPesajeID}:
 *   delete:
 *     summary: Eliminar un registro de pesaje
 *     tags: [LogPesaje]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: logPesajeID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente
 */

router.delete(
  "/:reptileID/logPesaje/:logPesajeID",
  param("logPesajeID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  LogPesajeController.deleteLog,
);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logPesaje/{logPesajeID}:
 *   patch:
 *     summary: Actualizar un registro de pesaje
 *     tags: [LogPesaje]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: logPesajeID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogPesaje'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *       404:
 *         description: Registro no encontrado
 */

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
  LogPesajeController.updateLog,
);
//#endregion Log Pesaje
/**
 * @swagger
 * components:
 *   schemas:
 *     LogComidas:
 *       type: object
 *       required:
 *         - cantidad
 *         - tipoAlimento
 *         - reptil
 *       properties:
 *         _id:
 *           type: string
 *         cantidad:
 *           type: number
 *           minimum: 0
 *           example: 5
 *         unidad:
 *           $ref: '#/components/schemas/Unidad'
 *         tipoAlimento:
 *           $ref: '#/components/schemas/TipoAlimento'
 *         suplemento:
 *           type: string
 *           example: Calcio
 *         metodo:
 *           $ref: '#/components/schemas/MetodoAlimentacion'
 *         observaciones:
 *           type: string
 *           example: Buen apetito
 *         excreto:
 *           type: boolean
 *           example: true
 *         apetito:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         reptil:
 *           type: string
 *           description: ID del reptil
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

//#region Log Comidas
router.param("logComidaID", logComidaExist);
router.param("logComidaID", logComidaBelongsToReptil);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logComidas:
 *   get:
 *     summary: Obtener logs de comida de un reptil
 *     tags: [LogComidas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de registros de comida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LogComidas'
 */

router.get("/:reptileID/logComidas", LogComidaController.getLogs);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logComidas/{logComidaID}:
 *   get:
 *     summary: Obtener un log de comida por ID
 *     tags: [LogComidas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: logComidaID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro de comida encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogComidas'
 *       404:
 *         description: Registro no encontrado
 */

router.get("/:reptileID/logComidas/:logComidaID", LogComidaController.getLogById);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logComidas:
 *   post:
 *     summary: Crear un registro de comida
 *     tags: [LogComidas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogComidas'
 *     responses:
 *       200:
 *         description: Registro de comida creado correctamente
 *       400:
 *         description: Error de validación
 */

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
      `El  metodo de alimento debe ser uno de: ${Object.values(metodoAlimentacion).join(", ")}`,
    ),
  handleInputErrors,
  LogComidaController.createLog,
);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logComidas/{logComidaID}:
 *   delete:
 *     summary: Eliminar un registro de comida
 *     tags: [LogComidas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: logComidaID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente
 */

router.delete(
  "/:reptileID/logComidas/:logComidaID",
  param("logComidaID").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  LogComidaController.deleteLog,
);
/**
 * @swagger
 * /api/reptiles/{reptileID}/logComidas/{logComidaID}:
 *   patch:
 *     summary: Actualizar un registro de comida
 *     tags: [LogComidas]
 *     parameters:
 *       - in: path
 *         name: reptileID
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: logComidaID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogComidas'
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente
 *       404:
 *         description: Registro no encontrado
 */

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
      `El  metodo de alimento debe ser uno de: ${Object.values(metodoAlimentacion).join(", ")}`,
    ),
  handleInputErrors,
  LogComidaController.updateLog,
);
//#endregion Log Comidas
export default router;
