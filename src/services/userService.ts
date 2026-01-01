import { prisma } from "../config/prisma.js";
import { UpdateUserDTO, UpdatePasswordDTO, CreateUserDTO} from "../types/userType.js";
import bcrypt from "bcrypt";
import { ValidationError } from "../middlewares/error.js";

export class UserService {

    //Create User - Admin use only
    static async createUser(data: CreateUserDTO) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser) {
            throw new ValidationError('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password!, 10);

        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword
            }
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    //Get user by ID
    static async getUserById(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                userRole: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            throw new ValidationError('User not found');
        }
        return user;
    }

    //Get user profile 
    static async getUserProfile(userId: number) {
        const user = await this.getUserById(userId);
        return user;
    }

    //Update user profile
    static async updateUser(userId: number, data: UpdateUserDTO) {

        const user = await this.getUserById(userId);
        
        if(data.email && data.email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email }
            });
            if (existingUser) {
                throw new ValidationError('Email already in use');
            }
        }

        const updateUser = await prisma.user.update({
            where:{ id : userId },
            data: data,
        });

        const { password, ...userWithoutPassword } = updateUser;
        return userWithoutPassword;
    };
    
    //Update Password
    static async updatePassword(
        userId: number,
        currentPassword: string,
        newPassword: string,)
        {
        const user = await prisma.user.findUnique({
            where: {id: userId}
        });
        if(!user){
            throw new ValidationError('User not found');
        }

        const isPasswordValid = await bcrypt.compare(newPassword, user.password);
        if(!isPasswordValid){
            throw new ValidationError('Current password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: {id: userId},
            data: { password: hashedNewPassword }
        });
        return { message: 'Password updated successfully' };
    }

    //Get all users
    static async GetAllUsers() {
        const users = await prisma.user.findMany();

        var userWithoutPasswordList = [];
        for (var index in users) {
            const user = users[index];
            const { password, ...userWithoutPassword } = user;
            userWithoutPasswordList.push(userWithoutPassword);
        }
        return userWithoutPasswordList;
    }

    //Delete user
    static async deleteUser(userId: number) {
        await this.getUserById(userId); 

        await prisma.user.delete({
            where: { id: userId }
        });

        return { message: 'User deleted successfully' };
    }
}

