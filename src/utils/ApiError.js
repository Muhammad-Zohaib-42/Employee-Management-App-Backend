class ApiError extends Error {
    constructor(statusCode, errors = [], message = "Something went wrong", stack = "") {
        super(message)
        this.statusCode = statusCode,
        this.errors = errors,
        this.success = false

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiResponse