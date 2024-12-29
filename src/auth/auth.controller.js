import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Auth } from "./auth.model.js";

export const signUp = async (req, res, next) => {
    const { email, role, password } = req.body;
    try {
        const userExists = await Auth.findOne({ email });
        if (userExists) {
            throw new ApiError(400, `User already exists`);
        }
        const response = await Auth.create({ email, role, password });
        const { password: _, ...user } = response._doc;
        return res
            .status(200)
            .json(new ApiResponse(200, "User created successfully"));
    } catch (error) {
        next(error);
    }
};

export const signIn = async (req, res, next) => {
    const { email, password, role} = req.body;
    if ([email, password, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    try {
        const validUser = await Auth.findOne({ email });
        if (!validUser) {
            throw new ApiError(404, `Please sign up first`);
        }

        if(validUser.role !== role) {
            throw new ApiError(401, "Unauthorized role access");
        }
        const validPassword = await validUser.isPasswordCorrect(password);
        if (!validPassword) {
            throw new ApiError(401, "Invalid credentials");
        }
        const { password: _, ...rest } = validUser._doc;
        const accessToken = validUser.generateAccessToken();
        return res
            .status(200)
            .json(
                new ApiResponse(200, "User logged in successfully", accessToken)
            );
    } catch (error) {
        next(error);
    }
};
