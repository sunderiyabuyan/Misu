import { prisma } from "../config/prisma.js";
import { LoginDTO, AuthResponse, TokenResponse, RefreshTokenPayload } from "../types/authType.js";
import { AuthError, ValidationError } from "../middlewares/error.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { number } from "zod";

export class AuthService {

    private static generateAccessToken(userId: number, userRole: string, businessId?: number | null): string {
    
        return jwt.sign(
            { userId, userRole, businessId  },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '7d' }
        );
    }
    private static generateRefreshToken(userId: number): string {
        return jwt.sign(
            { userId: userId },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '2h' }
        );
    }

    static async login(data: LoginDTO): Promise<AuthResponse & { refreshToken: string }> {
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user) {
            throw new AuthError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
            throw new AuthError('Invalid email or password');
        }

        const accessToken = this.generateAccessToken(
            user.id,
            user.userRole,
            user.businessId
          );
          
        const refreshToken = this.generateRefreshToken(user.id);

        const { password: _, ...userWithoutPassword } = user;

        return {
            userId: user.id,
            token: accessToken,
            refreshToken: refreshToken,
            userRole: user.userRole
        };
    }

    static async refreshToken(token: string): Promise<TokenResponse & { refreshToken: string }> {
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_REFRESH_SECRET!
            ) as RefreshTokenPayload;

            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (!user) throw new AuthError('Invalid refresh token');

            const accessToken = this.generateAccessToken(user.id, user.userRole);
            const newRefreshToken = this.generateRefreshToken(user.id);

            return { accessToken, refreshToken: newRefreshToken };
        } catch {
            throw new AuthError('Invalid refresh token');
        }
    }
}


