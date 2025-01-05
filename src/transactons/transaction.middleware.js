import {ApiError} from "../utils/ApiError.js";

export const createTransactionMiddleware = (req, res, next) => {
    const { amount,  transactionId, denominationId} = req.body;
    if (!transactionId || !(amount || denominationId)) {
        throw new ApiError(400, "Amount and transactionId are required");
    }
    if(transactionId.trim() === "") throw new ApiError(400, "Transaction id is required");
    if(denominationId && denominationId.trim() === "") throw new ApiError(400, "Denomination id is required");
    next();
};