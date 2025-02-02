import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Portfolio } from "./portfolio.model.js";


export const createPortfolio = async (userId, planId, dateOfInvestment, amount, todayEarning, totalEarning, status) => {
    const portfolio = await Portfolio.create({ user: userId, plan: planId, dateOfInvestment, amount, todayEarning, totalEarning, status });
    return portfolio;
}

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

export const getPortfolios = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const portfolios = await Portfolio.find({ user: req.user._id })
            .select("-user")
            .populate("plan")
            .skip((page - 1) * limit)
            .limit(limit);

        return res
            .status(200)
            .json(new ApiResponse(200, "Portfolios fetched successfully", portfolios));
    } catch (error) {
        next(error);
    }
};
