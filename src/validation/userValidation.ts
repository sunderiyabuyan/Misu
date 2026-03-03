import {z} from 'zod';
import { UserRole } from '@prisma/client';

export const createUserSchema = z.object({
    firstName: z.string().min(1, 'Firstname is required'),
    lastName: z.string().min(1, 'Lastname is required'),
    userRole: z.enum(UserRole),
    businessId: z.number().optional(),
    email: z.email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    password: z.string().min(8, ' Password must be at least 8 characters long')
    .nonempty(' Password is required')
    .regex((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/), 'Password must contain at least one uppercase letter')
});

export const updateUserSchema = z.object({
    firstName: z.string().min(1, 'Firstname is required').optional(),
    lastName: z.string().min(1, 'Lastname is required').optional(),
    userRole: z.enum(UserRole).optional(),
    email: z.email('Invalid email address').optional(),
    phoneNumber: z.string().min(1, 'Phone number is required').optional()
});

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(1, 'Old pasword is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long')
                .nonempty('New password is required')
                .regex((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/), 'New password must contain at least one uppercase letter')
});