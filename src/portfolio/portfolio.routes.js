import express from "express";
import { createPortfolio, getPortfolios } from "./portfolio.controller.js";
import { authenticate, isAdmin } from "../middlewares/verifyJwt.js";

const router = express.Router();

// router.post("/create", authenticateUser, createPortfolio);
router.get("/", authenticate, getPortfolios);

export default router;
