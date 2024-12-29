import express from "express";
import cors from "cors";
import {connectDB} from "./config/database.js";
import {WhitelistedDomains} from "./constants/domains.js";
import {errorHandler} from "./utils/ErrorHandler.js";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./users/user.routes.js";

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

app.use(errorHandler);

export default app;