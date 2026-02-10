import { body, validationResult } from "express-validator"

async function validateResult(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res
        .status(400)
        .json({ errors: errors.array() })
    }

    next()
}

const registerUserValidationRules = [
    body("username")
    .notEmpty()
    .withMessage("username is required")
    .isString()
    .withMessage("username must be a string")
    .isLength({ min: 3, max: 20 })
    .withMessage("username length must be between 3 and 20 characters"),

    body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),

    validateResult
]

const loginUserValidationRules = [
    body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid email"),

    body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 characters long"),

    validateResult
]

export { registerUserValidationRules, loginUserValidationRules }