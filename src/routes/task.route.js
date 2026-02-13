import { Router } from "express";
import authAdmin from "../middlewares/authAdmin.middleware.js";
import { createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import { taskValidationRules } from "../middlewares/validation.middleware.js";

const router = Router()

router.post("/create", authAdmin, taskValidationRules, createTask)
router.patch("/update/:id", updateTask)
router.delete("/delete/:id", authAdmin, deleteTask)

export default router