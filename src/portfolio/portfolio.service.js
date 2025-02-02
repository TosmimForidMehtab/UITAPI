import { updateWallet } from "../wallet/wallet.service.js";
import { Portfolio } from "./portfolio.model.js";

export const updateTodayEarnings = async () => {
    try {
        console.log("Running portfolio earnings update...");

        const portfolios = await Portfolio.find({ status: "ACTIVE" }).populate("plan");

        for (let portfolio of portfolios) {
            const { dateOfInvestment, plan } = portfolio;
            const daysPassed = Math.floor((new Date() - new Date(dateOfInvestment)) / (1000 * 60 * 60 * 24));

            if (daysPassed <= plan.duration) {
                const todayEarning = Number(plan.totalReturnAmount) / Number(plan.duration) ? Number(plan.totalReturnAmount) / Number(plan.duration) * daysPassed : Number(portfolio.todayEarning);
                const totalEarning = Number(portfolio.totalEarning) + Number(todayEarning);

                await Portfolio.updateOne(
                    { _id: portfolio._id },
                    { $set: { todayEarning, totalEarning } }
                );

                console.log(`Updated portfolio ${portfolio._id} - TodayEarning: ${todayEarning}, TotalEarning: ${totalEarning}`);
            }else{
                await Portfolio.updateOne(
                    { _id: portfolio._id },
                    { $set: { status: "SOLDOUT" } }
                );
                await updateWallet(portfolio.user, Number(portfolio.totalEarning));
            }
        }

        console.log("Portfolio earnings update completed.");
    } catch (error) {
        console.error("Error updating portfolio earnings:", error);
    }
};