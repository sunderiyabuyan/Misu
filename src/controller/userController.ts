import { UserService } from "../services/userService.js";
import { Request, Response } from "express";
import { AppError, ValidationError, AuthError } from "../middlewares/error.js";
import { CreateUserDTO, UpdateUserDTO } from "../types/userType.js";

export class UserController {

    static async createUser ( req: Request<{}, {}, CreateUserDTO>, res: Response) {
        try { 
            const newUser = await UserService.createUser(req.body);

            res.status(201).json({
                success: true,
                data: newUser
            });
        } catch (error) {
            console.error('Create User Error:', error);

            if (error instanceof ValidationError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: process.env.NODE_ENV === 'production' ? String(error) : undefined
                });
            } else if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: process.env.NODE_ENV === 'production' ? String(error) : undefined
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    error: process.env.NODE_ENV === 'production' ? String(error) : undefined
                });
            }
        }
    }

    static async getUserProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
                return;
            }

            const user = await UserService.getUserProfile(userId);

            res.status(200).json({
                success: true,
                data: user,
            });
        } catch (error) {
            console.error("Get profile error:", error);

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
                error:
                    process.env.NODE_ENV !== "production" ? String(error) : undefined,
            });
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
          const id = Number(req.params.id);
      
          if (isNaN(id)) {
            res.status(400).json({
              success: false,
              message: "Invalid user ID",
            });
            return;
          }
      
          const user = await UserService.getUserById(id);
      
          res.status(200).json({
            success: true,
            data: user,
          });
        } catch (error) {
          console.error("Cant get user profile:", error);
      
          res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      

    static async updatePassword(req: Request, res: Response): Promise<void> {
        try{
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({
                success: false,
                message: "Unathorised"
            });
            return;
        }

        const {currentPassword, newPassword} = req.body;
        const result = await UserService.updatePassword(userId, currentPassword, newPassword)

        res.status(200).json({
            success: true,
            data: result
        });
        } catch(error){
            console.error("Error Updating password: ", error);

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
                error: process.env.NODE_ENV !== "production" ? String(error) : undefined
            });
        }

    }
    
    static async updateUser(req: Request, res: Response): Promise<void>{
        try{
            const userId = req.user?.userId;
            if(!userId){
                res.status(401).json({
                    success: false,
                    message: "Unathorised"
                });
                return;
            }
            const data = req.body;
            const userInfo = await UserService.updateUser(userId, data);

            res.status(201).json({
                success: true,
                data: userInfo
            });
        }catch(error){
            console.error("Error Updating Profile: ", error);

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
                error: process.env.NODE_ENV !== "production" ? String(error) : undefined
            });
        }
    }

    static async deleteUser (req: Request, res: Response): Promise<void>{
        try{
            const userId = req.user?.userId;
            if(!userId){
                res.status(401).json({
                    success: false,
                    message: "Unathorised"
                });
                return;
            }

            const userData = await UserService.deleteUser(userId);

            res.status(201).json({
                success: true,
                data: userData
            });
        }catch(error){
            console.error("Error Deleting Profile: ", error);

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
                error: process.env.NODE_ENV !== "production" ? String(error) : undefined
            });
        }
    }

    static async getAllUser(req: Request, res: Response) : Promise<void>{
        try{
            const users = await UserService.GetAllUsers;

            res.status(201).json({
                success: true,
                data: users
            })
        }catch(error){
            console.error("Get all users data error:", error);

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Unknown error",
                error:
                    process.env.NODE_ENV !== "production" ? String(error) : undefined,
            });
        }
        
    }

}