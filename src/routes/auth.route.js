import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js"
import { registerUserValidationRules, loginUserValidationRules } from "../middlewares/validation.middleware.js";

const router = Router()

router.post("/register", upload.single("avatar"), registerUserValidationRules, registerUser)
router.post("/login", loginUserValidationRules, loginUser)

export default router