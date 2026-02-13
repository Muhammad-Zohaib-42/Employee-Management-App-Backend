import asyncHandler from "../utils/asyncHandler.js";
import Task from "../models/task.model.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js";

const createTask = asyncHandler( async (req, res) => {
    const { title, description, asignTo } = req.body
    const { organization } = req.cookies

    const task = await Task.create({
        title,
        description,
        asignTo,
        organization
    })

    if (!task) {
        throw new ApiError(500, "failed to create task")
    }

    return res
    .status(201)
    .json(new ApiResponse(
        201,
        { task },
        "task created successfully!"
    ))
} )

const updateTask = asyncHandler( async (req, res) => {
    const { id } = req.params
    
    if (Object.keys(req.body).length === 0) {
        throw new ApiError(400, "No field provided for update")
    }

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    )

    if (!updatedTask) {
        throw new ApiError(404, "Task not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        { task: updatedTask },
        "task updated successfully"
    ))
} )

const deleteTask = asyncHandler( async (req, res) => {
    const { id } = req.params

    const deleted = await Task.findByIdAndDelete(id)

    if (!deleted) {
        throw new ApiError(500, "fail to delete task")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        { task: deleted },
        "task deleted successfully"
    )) 
} )

export { createTask, updateTask, deleteTask }