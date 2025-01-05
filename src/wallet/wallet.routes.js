import express from "express";
import {addMoney, createOrUpdateUpi, getDenominations, getUpis, getWallet, withdrawMoney} from "./wallet.controller.js";
import {authenticate, isAdmin} from "../middlewares/verifyJwt.js";
import {updateDenominations} from "./wallet.service.js";

const router = express.Router();

router.patch("/deposit", authenticate, addMoney);
router.patch("/withdraw", authenticate, withdrawMoney);
router.get("/", authenticate, getWallet);

router.get("/upi", authenticate, isAdmin, getUpis);
router.post("/upi", authenticate, isAdmin, createOrUpdateUpi);
router.get("/denominations", authenticate, isAdmin, getDenominations);
router.patch("/denominations", authenticate, isAdmin, updateDenominations);

export default router;