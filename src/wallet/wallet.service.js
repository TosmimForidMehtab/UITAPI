import { ApiError } from "../utils/ApiError.js";
import { Denomination, Upi, Wallet } from "./wallet.model.js";

export const createWallet = async (userId) => {
	const wallet = await Wallet.create({ user: userId, balance: 0 });
	return wallet;
};

export const updateWallet = async (userId, amount) => {
	const wallet = await Wallet.findOne({ user: userId });
	if (wallet.balance + amount < 0) {
		throw new ApiError(400, "Insufficient balance");
	}
	return await Wallet.findOneAndUpdate(
		{ user: userId },
		{ $inc: { balance: amount } },
		{ new: true }
	);
};

export const getWallet = async (userId) => {
	return await Wallet.findOne({ user: userId }).select("-user");
};

export const createUpi = async (userId, upiId) => {
	const upi = await Upi.create({ user: userId, upiId });
	return upi;
};

export const getUpis = async () => {
	return await Upi.find({}).select("-user").sort({ updatedAt: -1 });
};

export const updateUpi = async (userId, upiId) => {
	const upi = await Upi.findOneAndUpdate(
		{ user: userId },
		{ $set: { upiId } },
		{ new: true }
	);
	return upi;
};

export const getUpiById = async (userId) => {
	return await Upi.findOne({ user: userId }).select("-user");
};

export const createDenominations = async (amount) => {
	const denominations = await Denomination.create({ amount });
	return denominations;
};

export const updateDenominations = async (id, amount) => {
	const denominations = await Denomination.findByIdAndUpdate(
		id,
		{ $set: { amount } },
		{ new: true }
	);
	return denominations;
};

export const getDenominations = async () => {
	return await Denomination.find({});
};

export const getDenominationById = async (id) => {
	return await Denomination.findById(id);
};
