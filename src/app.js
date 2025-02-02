import express from "express";
import cors from "cors";
import cron from "node-cron";
import {connectDB} from "./config/database.js";
import {WhitelistedDomains} from "./constants/domains.js";
import {errorHandler} from "./utils/ErrorHandler.js";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./users/user.routes.js";
import transactionRoutes from "./transactons/transaction.routes.js";
import walletRoutes from "./wallet/wallet.routes.js";
import plansRoutes from "./plans/plans.routes.js";
import portfolioRoutes from "./portfolio/portfolio.routes.js";
import { updateTodayEarnings } from "./portfolio/portfolio.service.js";


const app = express();
const corsOptions = {
    origin: (origin, callback) => {
        if (WhitelistedDomains.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
connectDB();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/plans", plansRoutes);
app.use("/api/v1/portfolios", portfolioRoutes);



// Schedule cron job to update earnings every 24 hours
cron.schedule("0 0 * * *", () => {
    updateTodayEarnings();
});

app.use(errorHandler);

export default app;