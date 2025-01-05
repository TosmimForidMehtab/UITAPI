import {ApiResponse} from "../utils/ApiResponse.js";
import {updateWallet, getWallet as getWalletService, createUpi as createUpiService, getUpiById, updateUpi, getUpis as getUpisService, getDenominations as getDenominationsService, updateDenominations as updateDenominationsService} from "./wallet.service.js";

export const addMoney = async (req, res, next) => {
    const { amount } = req.body;
    const user = req.user;
    try {
        if(amount <= 0) throw new ApiError(400, "Invalid amount");
        const wallet = await updateWallet(user._id, amount);
        return res
            .status(200)
            .json(new ApiResponse(200, "Wallet updated successfully", wallet));
    } catch (error) {
        next(error);
    }
};

export const withdrawMoney = async (req, res, next) => {
    const { amount } = req.body;
    const user = req.user;
    try {
        if(amount <= 0) throw new ApiError(400, "Invalid amount");
        const wallet = await updateWallet(user._id, -amount);
        return res
            .status(200)
            .json(new ApiResponse(200, "Wallet updated successfully", wallet));
    } catch (error) {
        next(error);
    }
};

export const getWallet = async (req, res, next) => {
    const user = req.user;
    try {
        const wallet = await getWalletService(user._id);
        const upis = await getUpisService();
        const denominations = await getDenominations();
        const response = {wallet, upis, denominations};
        return res
            .status(200)
            .json(new ApiResponse(200, "Wallet fetched successfully", response));
    } catch (error) {
        next(error);
    }
}

export const createOrUpdateUpi = async (req, res, next) => {
    const { upiId } = req.body;
    const user = req.user;
    try {
        if(!upiId || upiId.trim() === "") throw new ApiError(400, "Upi id is required");
        const upi = await getUpiById(user._id);
        if(!upi) await createUpiService(user._id, upiId);
        await updateUpi(user._id, upiId);
        return res
            .status(200)
            .json(new ApiResponse(upi ? 200 : 201, `Upi ${upi ? "updated" : "created"} successfully`));
    } catch (error) {
        next(error);
    }
}

export const getUpis = async (req, res, next) => {
    try {
        const upis = await getUpisService();
        return res
            .status(200)
            .json(new ApiResponse(200, "Upis fetched successfully", upis));
    } catch (error) {
        next(error);
    }
}

export const getDenominations = async (req, res, next) => {
    try {
        const denominations = await getDenominations();
        return res
            .status(200)
            .json(new ApiResponse(200, "Denominations fetched successfully", denominations));
    } catch (error) {
        next(error);
    }
}

export const updateDenominations = async (req, res, next) => {
    const { id, amount } = req.body;
    try {
        if(!id || id.trim() === "") throw new ApiError(400, "Denomination id is required");
        if(!amount || amount <= 0) throw new ApiError(400, "Valid amount is required");
        const denominations = await updateDenominationsService(id, amount);
        return res
            .status(200)
            .json(new ApiResponse(200, "Denominations updated successfully", denominations));
    } catch (error) {
        next(error);
    }
}