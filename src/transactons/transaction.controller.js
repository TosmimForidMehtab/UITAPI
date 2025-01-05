import { Transaction } from "./transaction.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {getDenominationById, updateWallet} from "../wallet/wallet.service.js";

export const getMyTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({user: req.user._id}).select('-user').sort({createdAt: -1});
        return res
            .status(200)
            .json(new ApiResponse(200, "Transactions fetched successfully", transactions));
    } catch (error) {
        next(error);
    }
};

export const createTransaction = async (req, res, next) => {
    const { amount, transactionId, denominationId } = req.body;
    const user = req.user;
    try {
        let value = amount;
        if(denominationId){
            value = await getDenominationById(denominationId);
        }
        const transaction = await Transaction.create({ amount: value, user, transactionId });
        return res
            .status(200)
            .json(new ApiResponse(200, "Transaction created successfully"));
    } catch (error) {
        next(error);
    }
};

export const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({}).sort({createdAt: -1});
        return res
            .status(200)
            .json(new ApiResponse(200, "Transactions fetched successfully", transactions));
    } catch (error) {
        next(error);
    }
};

export const updateTransaction = async (req, res, next) => {
    const { transactionId, status, reason } = req.body;
    try {
        if(!transactionId || transactionId.trim() === "") throw new ApiError(400, "Transaction id is required");
        if(!status || status.trim() === "") throw new ApiError(400, "Status is required");
        const transaction = await Transaction.findOneAndUpdate({transactionId}, {status, reason}, {new: true});
        console.log(transaction);
        if(transaction.status === 'COMPLETED'){
            await updateWallet(transaction.user, transaction.amount);
        }
        return res
            .status(200)
            .json(new ApiResponse(200, "Transaction updated successfully", transaction));
    } catch (error) {
        next(error);
    }
}