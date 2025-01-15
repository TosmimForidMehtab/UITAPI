import { ApiError } from "../utils/ApiError.js";

export const createTransactionMiddleware = (req, res, next) => {
	const { amount, transactionId, denominationId, type } = req.body;
	if (
		((!type || type !== "WITHDRAWAL") && !transactionId) ||
		!(amount || denominationId)
	) {
		throw new ApiError(400, "Amount and transactionId are required");
	}
	if (transactionId && transactionId.trim() === "")
		throw new ApiError(400, "Transaction id is required");
	if (denominationId && denominationId.trim() === "")
		throw new ApiError(400, "Denomination id is required");
	next();
};
