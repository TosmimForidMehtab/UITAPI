import express from "express";
import { createTransaction, getAllTransactions, getMyTransactions, updateTransaction } from "./transaction.controller.js";
import {authenticate, isAdmin} from "../middlewares/verifyJwt.js";
import {createTransactionMiddleware} from "./transaction.middleware.js";

const router = express.Router();

router.get("/", authenticate, getMyTransactions);
router.get("/all", authenticate, isAdmin, getAllTransactions);
router.post("/", authenticate, createTransactionMiddleware, createTransaction);
router.patch("/", authenticate, isAdmin, updateTransaction);

export default router;