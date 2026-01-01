import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWTTokenPayload } from "../types/authType.js";
import { ZodType} from 'zod';


export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as JWTTokenPayload;

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export function authorizedRoles(...allowedRoles: UserRole[]){
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "Authentication required",
          });
        }
    
        if (!allowedRoles.includes(req.user.userRole)) {
          return res.status(403).json({
            success: false,
            message: "Insufficient permissions",
          });
        }
    
        next();
      };
}

export const validate =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        errors: result.error.issues,
      });
      return;
    }

    req.body = result.data as T;
    next();
  };

