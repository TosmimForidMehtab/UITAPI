import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

const authSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: (value) => {
                return validator.isStrongPassword(value, {
                    minLength: 6,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                });
            },
            message:
                "Password must be at least 6 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol",
        },
    },
    role: {
        type: String,
        enum: {
            values: ["ADMIN", "USER"],
            message: "{VALUE} is not supported",
        },
        default: "USER",
    },
});

authSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        // return next();
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

authSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

authSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const Auth = mongoose.model("Auth", authSchema);
