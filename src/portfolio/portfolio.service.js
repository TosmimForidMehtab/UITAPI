import { Portfolio } from "./portfolio.model.js";

export const createPortfolio = async (userId, planId, dateOfInvestment, amount, todayEarning, totalEarning, status) => {
    const portfolio = await Portfolio.create({ user: userId, plan: planId, dateOfInvestment, amount, todayEarning, totalEarning, status });
    return portfolio;
}