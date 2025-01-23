import { Auth } from "../auth/auth.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await Auth.find({role: "USER"}).select("-password");
        return res
            .status(200)
            .json(new ApiResponse(200, "Users fetched successfully", users));
    } catch (error) {
        next(error);
    }
};

export const getReferralUrl = async (req, res, next) => {
    try {
        const authUser = req.user;
        const user = await Auth.findById(authUser._id).select("-password");

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const baseUrl = process.env.FRONTEND_URL;
        const referralUrl = `${baseUrl}/signup?refer=${user?.referralCode || ""}`;
        const referCode = user?.referralCode || "";
        return res
            .status(200)
            .json(new ApiResponse(200, "Referral URL fetched successfully", {
                referCode,
                referralUrl
            }));
    } catch (error) {
        next(error);
    }
};
