import {z} from 'zod';
import { UserRole } from '@prisma/client';

// export const registerSchema = z.object({
//     firstName: z.string().min(1, 'Firstname is required'),
//     lastName: z.string().min(1, 'Lastname is required'),
//     userRole: z.enum(UserRole),
//     email: z.email('Invalid email address'),
//     phoneNumber: z.string().min(1, 'Phone number is required'),
//     password: z.string().min(8, ' Password must be at least 8 characters long')
//     .nonempty(' Password is required')
//     .regex((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/), 'Password must contain at least one uppercase letter')
// });


export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});




