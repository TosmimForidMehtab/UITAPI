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