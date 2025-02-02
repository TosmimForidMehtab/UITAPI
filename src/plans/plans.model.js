import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    type:{
        type: String,
        enum: {
            values: ["RUNNING", "UPCOMING", "EXPIRED"],
            message: "{VALUE} is not supported",
        },
        default: "RUNNING"
    },
    logo:{
        type: String,
        default: ''
    },
    returnPercentage: {
        type: Number
    },
}, { timestamps: true });

export const Plan = mongoose.model("Plan", planSchema);