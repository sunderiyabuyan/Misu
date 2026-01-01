import { Request, Response } from "express";
import { LoginDTO } from "../types/authType.js";
import { AuthService } from "../services/authService.js";
import { AppError, AuthError, ValidationError } from "../middlewares/error.js";

export class AuthController {

    private static readonly REFRESH_TOKEN_COOKIE_OPTIONS = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "strict" as const,
        maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string, 10) * 1000,
        path: '/'
    };

    static async login ( req: Request<{}, {}, LoginDTO>, res: Response) {
        try {
            const authData = await AuthService.login(req.body);

            res.cookie('refreshToken', authData.refreshToken, AuthController.REFRESH_TOKEN_COOKIE_OPTIONS);

            res.status(200).json({
                success: true,
                data: {
                    user: authData.userId,
                    token: authData.token
                }

        });
        return;
            } catch (error) {
                console.error('Login Error:', error);
    
                if (error instanceof AuthError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message,
                        error: process.env.NODE_ENV === 'production' ? String(error) : undefined
                    });
                } else if (error instanceof ValidationError) {
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
    
        static async refreshToken ( req: Request, res: Response) {

            try{
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken) {
                    throw new AuthError('Refresh token not provided');
                }
                const tokens = await AuthService.refreshToken(refreshToken);
                res.cookie('refreshToken', tokens.refreshToken, AuthController.REFRESH_TOKEN_COOKIE_OPTIONS);

                res.status(200).json({
                    success: true,
                    data: {
                        token: tokens.accessToken
                    }
                });
                return;
                
            } catch (error) {
                console.error('Refresh Token Error:', error);

                if (error instanceof AuthError) {
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

    static async logout ( req: Request, res: Response) {
        try{ 
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
              });
              

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            console.error('Logout Error:', error);

            if (error instanceof AppError) {
                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: process.env.NODE_ENV === 'production' ? String(error) : undefined
                });
            } else
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: process.env.NODE_ENV === 'production' ? String(error) : undefined
            });
        }
    }
}