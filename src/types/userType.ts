import { UserRole } from "@prisma/client";

export interface CreateUserDTO {
    firstName: string;
    lastName: string;
    userRole: UserRole;
    email: string;
    phoneNumber: string;
    password: string;
    businessId?: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface UpdateUserDTO {
    firstName?: string;
    lastName?: string;
    userRole?: UserRole;
    email?: string;
    phoneNumber?: string;
    updatedAt: Date | string;
}

export interface UpdatePasswordDTO {
    oldPassword: string;
    newPassword: string;
}
