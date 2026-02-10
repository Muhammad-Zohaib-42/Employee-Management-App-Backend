import ApiError from "../utils/ApiError.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const verifyJwt = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies

    if (!accessToken || !refreshToken) {
        throw new ApiError(400, "Unauthorized request")
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch(err) {
        throw new ApiError(500, "Unauthorized request, token expired")
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(400, "Invalid access Token")
        }

        req.user = user
        next()
    } catch(err) {
        throw new ApiError(400, "Unauthorized request")
    }
}

export default verifyJwt