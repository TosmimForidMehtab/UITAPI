import express from "express";
import { getPlans, createPlan, deletePlan, activatePlan, getActivePlanDetails } from "./plans.controller.js";
import { authenticate, isAdmin } from "../middlewares/verifyJwt.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getPlans);
router.post('/activate/:id', authenticate, activatePlan);
router.get("/active", authenticate, getActivePlanDetails);

router.post("/", authenticate, isAdmin, upload.single("logo"), createPlan);
router.delete("/:id", authenticate, isAdmin, deletePlan);

export default router;