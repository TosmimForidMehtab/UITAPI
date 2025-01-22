import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Auth } from "./auth.model.js";
import {createDenominations, createWallet, getDenominations} from "../wallet/wallet.service.js";
import { isPlanExpired } from "../plans/plans.service.js";
import { generateReferralCode } from "../utils/generateRefCode.js";

export const signUp = async (req, res, next) => {
    const { email, role, password } = req.body;
    const {referralCode} = req.query;
    try {
        const userExists = await Auth.findOne({ email });
        if (userExists) {
            throw new ApiError(400, `User already exists`);
        }

        const response = await Auth.create({ email, role, password, referralCode: generateReferralCode() });
        if (referralCode && role === "USER") {
            const referredUser = await Auth.findOne({ referralCode });
            if (!referredUser) {
                throw new ApiError(400, "Invalid referral code");
            }
            response.referredBy = referredUser._id;
            await response.save();
        }
        const { password: _, ...user } = response._doc;
        if(response.role === "USER") await createWallet(user);
        if(response.role === 'ADMIN'){
            const denominations = await getDenominations();
            const defaultDenominations = [100, 500, 1000, 2000];
            if (denominations?.length === 0) {
                await Promise.all(defaultDenominations.map(amount => createDenominations(amount)));
            }
        }
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
        if(validUser.role === "USER"){
            await isPlanExpired(validUser?.activePlan, validUser._id);
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, "User logged in successfully", accessToken)
            );
    } catch (error) {
        next(error);
    }
};