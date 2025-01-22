import express from "express";
import { getAllUsers, getReferralUrl } from "./user.controller.js";
import {authenticate, isAdmin} from "../middlewares/verifyJwt.js";

const router = express.Router();

router.get("/", authenticate, isAdmin, getAllUsers);
router.get("/ref", authenticate, getReferralUrl);
export default router;