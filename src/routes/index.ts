import { Router } from "express";
import authRoutes from "./authRoute.js";
import userRoutes from "./userRoute.js"

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
