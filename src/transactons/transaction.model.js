import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "DENIED"],
            message: "{VALUE} is not supported",
        },
        default: "PENDING"
    },
    reason: {
        type: String
    },
    type:{
        type: String,
        enum: {
            values: ["DEPOSIT", "WITHDRAWAL"],
            message: "{VALUE} is not supported",
            default: "DEPOSIT"
        }
    }
}, { timestamps: true });

export const Transaction = model("Transaction", transactionSchema);