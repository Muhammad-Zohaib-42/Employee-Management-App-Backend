import asyncHandler from "../utils/asyncHandler.js"
import User from "../models/user.model.js"
import uploadFile from "../services/uploadFile.service.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { options } from "../constants.js"

async function generateAccessAndRefreshToken(userId) {
    const user = await User.findById(userId)

    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()

    if (!refreshToken || !accessToken) {
        throw new ApiError(500, "failed to generate authentications tokens")
    }

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

const registerUser = asyncHandler( async (req, res) => {
    const { username, email, password, role } = req.body

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user already exist with this username or email")
    }

    const { file } = req
    let fileUrl = null

    if (file) {
        const { buffer, originalname } = file
        const response = await uploadFile(buffer.toString("base64"), originalname)
        fileUrl = response.url
    }

    const user = await User.create({
        username,
        email,
        password,
        role,
        avatar: fileUrl
    })

    if (!user) {
        throw new ApiError(500, "failed to create user")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        201,
        {
            user: createdUser,
            accessToken,
            refreshToken
        },
        "user registered successfully"
    ))
} )

const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(500, "user not found, please try register first")
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError("Invalid credentials")
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.
    status(200).
    cookie("accessToken", accessToken, options).
    cookie("refreshToken", refreshToken, options).
    json(new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User loggedIn successfully!"
    ))
} )

export { registerUser, loginUser }