import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
});

const upiSchema = new mongoose.Schema({
    upiId: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
});

const denominations = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
});

export const Wallet = mongoose.model("Wallet", walletSchema);
export const Upi = mongoose.model("Upi", upiSchema);
export const Denomination = mongoose.model("Denomination", denominations);