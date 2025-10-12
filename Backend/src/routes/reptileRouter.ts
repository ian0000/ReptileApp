import { Router } from "express";
import { handleInputErrors } from "../middleware/validation";
import { ReptilController } from "../controllers/ReptilController";
import { body, param } from "express-validator";

const router = Router();

router.post(
  "/create-reptil",
  body("name").notEmpty().withMessage("El nombre del reptil es obligatorio"),
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
export default router;
