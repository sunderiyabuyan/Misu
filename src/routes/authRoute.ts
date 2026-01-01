import { Router } from "express";
import { AuthController } from "../controller/authController.js";
import { requireAuth, validate  } from "../middlewares/authHelpers.js";
import { loginSchema } from "../validation/authValidation.js";
import { asyncHandler } from "../middlewares/async.js";

const router = Router();

router.post("/login", (req, _, next) => {
    console.log("BODY:", req.body);
    next();
  }, validate(loginSchema), AuthController.login);
  

router.post('/logout', requireAuth, AuthController.logout);

router.post('/refresh', asyncHandler(AuthController.refreshToken))

export default router;