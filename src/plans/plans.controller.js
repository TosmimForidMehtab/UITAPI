import { Auth } from "../auth/auth.model.js";
import { Transaction } from "../transactons/transaction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateTransactionId } from "../utils/generateTId.js";
import { getWallet, updateWallet } from "../wallet/wallet.service.js";
import { Plan } from "./plans.model.js";
import * as dayjs from "dayjs";
import { isPlanExpired } from "./plans.service.js";

export const getPlans = async (req, res, next) => {
    try {
        const plans = await Plan.find();
        return res
            .status(200)
            .json(new ApiResponse(200, "Plans fetched successfully", plans));
    } catch (error) {
        next(error);
    }
};

export const createPlan = async (req, res, next) => {
    const { name, price, description, duration } = req.body;
    try {
        const plan = await Plan.create({ name, price, description, duration });
        return res
            .status(201)
            .json(new ApiResponse(201, "Plan created successfully"));
    } catch (error) {
        next(error);
    }
};

export const deletePlan = async (req, res, next) => {
    const { id } = req.params;
    try {
        const plan = await Plan.findByIdAndDelete(id);
        if (!plan) throw new ApiError(404, "Plan not found");
        return res
            .status(200)
            .json(new ApiResponse(200, "Plan deleted successfully"));
    } catch (error) {
        next(error);
    }
};

export const activatePlan = async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    try {
        const plan = await Plan.findById(id);
        if (!plan) throw new ApiError(404, "Plan not found");
        const wallet = await getWallet(user._id);
        await isPlanExpired(plan._id, user._id);
        if (
            wallet.balance < plan.price ||
            wallet.balance - plan.price < wallet.balance * 0.05
        ){
            throw new ApiError(
                400,
                "Insufficient balance to activate plan"
            );
        }
        const currentUser = await Auth.findById(user._id);
        if(currentUser?.activePlan && currentUser.activePlan === id) throw new ApiError(400, "Plan already active");
        const transaction = await Transaction.create({
            amount: plan.price,
            user: user._id,
            transactionId: generateTransactionId('SUBSCRIPTION'),
            type: "WITHDRAWAL",
            status: "COMPLETED",
        })
        await updateWallet(user._id, -plan.price);
        currentUser.activePlan = plan._id;
        currentUser.planExpiry = dayjs().add(plan.duration, 'month').toDate();
        await currentUser.save();
        return res
            .status(200)
            .json(new ApiResponse(200, "Plan activated successfully"));
    } catch (error) {
        next(error);
    }
};