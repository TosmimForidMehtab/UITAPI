import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Portfolio } from "./portfolio.model.js";

export const getPortfolio = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.find({ user: req.user._id }).select("-user").populate("plan");
        if(!portfolio) return res.status(200).json(new ApiResponse(200, "Portfolio not found"));
        return res.status(200).json(new ApiResponse(200, "Portfolio fetched successfully", portfolio));

    } catch (error) {
        next(error);
    }
};

export const updatePortfolio = async (req, res, next) => {
    const { plan, dateOfInvestment, amount, todayEarning, status } = req.body;
    try {
        const portfolio = await Portfolio.findOneAndUpdate({ user: req.user._id }, { plan, dateOfInvestment, amount, todayEarning, status }, { new: true }).populate("plan");
        if(!portfolio) throw new ApiError(404, "Portfolio not found");
        return res.status(200).json(new ApiResponse(200, "Portfolio updated successfully", portfolio));
    } catch (error) {
        next(error);
    }
};