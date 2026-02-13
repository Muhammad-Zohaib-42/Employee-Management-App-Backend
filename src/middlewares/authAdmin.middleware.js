import ApiError from "../utils/ApiError.js";

const authAdmin = (req, res, next) => {
    const { user } = req

    if (user.role === "employee") {
        throw new ApiError(400, "Only admin can do this")
    } else if (user.role === "admin") {
        next()
    }
}

export default authAdmin