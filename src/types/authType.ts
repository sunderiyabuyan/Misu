import { UserRole } from "@prisma/client";

// export interface RegisterSchema {
//     firstName: string;
//     lastName: string;
//     userRole: UserRole;
//     email: string;
//     phoneNumber: string;
//     password: string;
//     createdAt: Date | string;
//     updatedAt: Date | string;
// }

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    userId: number;
    userRole: UserRole;
}

export interface RefreshTokenPayload {
    userId: number;
    iat?: number;
    exp?: number;
}

// export interface ForgotPasswordDTO {
//     email: string;
// }

export interface TokenResponse {
    accessToken: string;
}

export interface JWTTokenPayload {
    userId: number;
    userRole: UserRole;
    businessId?: number | null,
    iat: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: JWTTokenPayload;
        }
    }
}