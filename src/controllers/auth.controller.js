import asyncHandler from "../utils/asyncHandler.js"

const registerUser = asyncHandler( async (req, res) => {
    const { username, email, password, role = "employee" } = req.body

    console.log(username, email, password, role)

    return res.status(201).json({message: "user created successfully"})
} )

export { registerUser }