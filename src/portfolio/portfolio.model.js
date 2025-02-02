import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
   plan: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Plan",
       required: true,
   },
   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Auth",
       required: true,
   },
   dateOfInvestment: {
       type: Date,
       required: true,
   },
   amount: {
       type: Number,
       required: true,
   },
   todayEarning: {
       type: Number,
       required: true,
   },
   totalEarning: {
       type: Number,
       required: true,
   },
   status: {
       type: String,
       enum: {
           values: ["ACTIVE", "SOLDOUT"],
           message: "{VALUE} is not supported",
       },
       default: "ACTIVE"
   },
});

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);