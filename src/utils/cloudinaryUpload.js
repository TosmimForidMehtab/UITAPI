import {ApiError} from "./ApiError.js";
import {v2 as cloudinaryService} from 'cloudinary'
import fs from "fs";

cloudinaryService.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return new ApiError(500, "Couldn't find the file");

        const response = await cloudinaryService.uploader.upload(localFilePath, {
            resource_type: "raw",
        });
        fs.unlinkSync(localFilePath);
        // console.log(response.url);
        return response.secure_url;
    } catch (error) {
        logger.error(error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};