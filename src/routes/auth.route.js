import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js"
import registerUserValidationRules from "../middlewares/validation.middleware.js";

const router = Router()

router.post("/register", upload.single("avatar"), registerUserValidationRules, registerUser)

export default router