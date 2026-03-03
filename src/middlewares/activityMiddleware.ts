import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";

export async function requireActiveBusiness(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const businessId = req.user?.businessId;
    const role = req.user?.userRole;

    // Global admin bypass
    if (role === "ADMIN") {
      return next();
    }

    if (!businessId) {
      return res.status(403).json({
        success: false,
        message: "No business associated with this user",
      });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { status: true },
    });

    if (!business || business.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Business is inactive",
      });
    }

    next();
  } catch (error) {
    console.error("requireActiveBusiness error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
