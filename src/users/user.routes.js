import express from "express";
import { getAllUsers } from "./user.controller.js";
import {authenticate, isAdmin} from "../middlewares/verifyJwt.js";

const router = express.Router();

router.get("/", authenticate, isAdmin, getAllUsers);
export default router;