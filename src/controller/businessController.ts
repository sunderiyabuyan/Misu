import { BusinessService } from "../services/businessService.js";
import { AppError, ValidationError, AuthError } from "../middlewares/error.js";
import { Request, Response } from "express";
import {
  CreateBusinessDTO,
  UpdateBusinessDTO,
  AssignOwnerDTO,
  UpdateStatus,
} from "../types/businessType.js";
import { UserRole } from "@prisma/client";

export class BusinessController {

  // ADMIN ONLY
  static async createBusiness(
    req: Request<{}, {}, CreateBusinessDTO>,
    res: Response
  ): Promise<void> {
    try {
      if (req.user?.userRole !== UserRole.ADMIN) {
        throw new AuthError("Only admin can create businesses");
      }

      const business = await BusinessService.createBusiness(req.body);

      res.status(201).json({
        success: true,
        data: business,
      });
    } catch (error) {
      BusinessController.handleError(res, error);
    }
  }

  // OWNER ONLY (own business)
  static async updateBusiness(
    req: Request<{}, {}, UpdateBusinessDTO>,
    res: Response
  ): Promise<void> {
    try {
      const { user } = req;

      if (!user?.businessId || user.userRole !== UserRole.OWNER) {
        throw new AuthError("Only business owner can update business");
      }

      const updated = await BusinessService.updateBusiness(
        user.businessId,
        req.body
      );

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      BusinessController.handleError(res, error);
    }
  }

  static async updateStatus( req: Request<{}, {}, UpdateStatus>,
    res: Response ): Promise<void> {
        try{

            if(req.user?.userRole !== UserRole.ADMIN){
                throw new AuthError("Unauthorized status change")
            }
            const statusUpdated = await BusinessService.updateStatus(req.body.businessId, req.body)
            res.status(200).json({
                success: true,
                data: statusUpdated,
              });
        } catch (error) {
          BusinessController.handleError(res, error);
        }
    
    }

  static async assignOwner(
    req: Request<{ id: string }, {}, AssignOwnerDTO>,
    res: Response
  ): Promise<void> {
    try {
      const businessId = Number(req.params.id);

      if (req.user?.userRole !== UserRole.ADMIN) {
        throw new AuthError("Only admin can change business owner");
      }
      

      const updated = await BusinessService.assignOwner(
        businessId,
        req.body
      );

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      BusinessController.handleError(res, error);
    }
  }

  // ADMIN or OWNER
  static async getBusinessById(
    req: Request<{ id: string }>,
    res: Response
  ): Promise<void> {
    try {
      const businessId = Number(req.params.id);
      if (isNaN(businessId)) {
        throw new ValidationError("Invalid business ID");
      }

      const business = await BusinessService.getBusinessById(businessId);

      res.status(200).json({
        success: true,
        data: business,
      });
    } catch (error) {
      BusinessController.handleError(res, error);
    }
  }

  // OWNER ONLY
  static async addUserToBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const businessId = req.user?.businessId;

      if (!businessId || req.user?.userRole == UserRole.STAFF) {
        throw new AuthError("Unauthorized");
      }

      const result = await BusinessService.addUserToBusiness(
        businessId,
        userId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      BusinessController.handleError(res, error);
    }
  }

  // OWNER ONLY
  static async removeUserFromBusiness(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      const businessId = req.user?.businessId;

      if (!businessId || req.user?.userRole == UserRole.STAFF) {
        throw new AuthError("Unauthorized");
      }

      const result = await BusinessService.removeUserFromBusiness(
        businessId,
        userId
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      BusinessController.handleError(res, error);
    }
  }

  // ADMIN ONLY
  static async getAllBusinesses(req: Request, res: Response): Promise<void> {
    try {
      if (req.user?.userRole !== UserRole.ADMIN) {
        throw new AuthError("Only admin can view all businesses");
      }

      const businesses = await BusinessService.getAllBusinesses();

      res.status(200).json({
        success: true,
        data: businesses,
      });
    } catch (error) {
      BusinessController.handleError(res, error);
    }
  }

  private static handleError(res: Response, error: unknown) {
    console.error(error);

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
