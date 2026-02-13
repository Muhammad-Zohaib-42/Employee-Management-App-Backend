import mongoose, { Schema } from "mongoose"

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ["new", "active", "completed"],
        default: "new"
    },
    asignTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    }
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)

export default Task