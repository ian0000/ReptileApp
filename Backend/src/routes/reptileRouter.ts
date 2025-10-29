import { Router } from "express";
import { handleInputErrors } from "../middleware/validation";
import { ReptilController } from "../controllers/ReptilController";
import { body, param } from "express-validator";

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

router.patch(
  "/update-reptil/:id",
  param("id").isMongoId().withMessage("Id no valido"),
  handleInputErrors,
  body("name").optional().notEmpty().withMessage("El nombre no puede estar vacío."),
  body("birthDate")
    .optional()
    .isDate()
    .withMessage("La fecha de nacimiento debe ser tipo fecha 'yyyy-MM-dddd.'"),
  body("description").optional(),
  body("genre").optional(),
  ReptilController.updateReptil
);
//#endregion
//#region Notas

//#endregion
export default router;
