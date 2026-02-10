import { Router } from "express";
import { loginUser, registerUser, refreshAccessToken, updateAvatar, logoutUser } from "../controllers/auth.controller.js";
import upload from "../middlewares/multer.middleware.js"
import { registerUserValidationRules, loginUserValidationRules } from "../middlewares/validation.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register", upload.single("avatar"), registerUserValidationRules, registerUser)
router.post("/login", loginUserValidationRules, loginUser)
router.get("/refresh-access-token", refreshAccessToken)

// protected routes
router.post("/update-avatar", verifyJwt, upload.single("avatar"), updateAvatar)
router.post("/logout", verifyJwt, logoutUser)

export default router