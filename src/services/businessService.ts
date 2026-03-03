import { prisma } from "../config/prisma.js";
import { UserRole } from "@prisma/client";
import { ValidationError } from "../middlewares/error.js";
import { CreateBusinessDTO, UpdateBusinessDTO, AssignOwnerDTO, UpdateStatus } from "../types/businessType.js";


export class BusinessService {

    static async createBusiness(data: CreateBusinessDTO){
        const owner = await prisma.user.findUnique({
            where: {id: data.ownerId}
        });
        if(!owner){
            throw new ValidationError('The user does not exist');
        } else if(owner.businessId){
            throw new ValidationError('User already has a business. Please use a separate owner user for a new business')
        } else if (owner.userRole != UserRole.OWNER){
            throw new ValidationError('User role is not correct')
        }

        const business = await prisma.business.create({
            data: {
                ...data, 
                users: {
                    connect: { id: data.ownerId}
                }
            }
        });

        await prisma.user.update({
            where: {id: data.ownerId},
            data: { businessId: business.id}
        });

        return business;
    }

    static async updateBusiness(businessId: number, data: UpdateBusinessDTO) {
        return prisma.business.update({
          where: { id: businessId },
          data: { ...data }
        });
    }

    static async updateStatus(businessId: number, data: UpdateStatus){
        return prisma.business.update({
            where: { id: businessId},
            data: {...data}
        });
    }


    static async assignOwner(businessId: number, data: AssignOwnerDTO){
        const user = await prisma.user.findUnique({ where: { id: data.ownerId } });
        
        if (!user || user.businessId !== businessId) {
            throw new ValidationError("User must belong to the business");
        }

        await prisma.user.updateMany({
            where: { businessId, userRole: "OWNER" },
            data: { userRole: "STAFF" }
        });

        await prisma.user.update({
            where: { id: data.ownerId},
            data: { userRole: "OWNER" }
        });

        return prisma.business.update({
            where: { id: businessId },
            data: { ownerId: data.ownerId }
        });
    }

    static async getBusinessById(businessId: number){
        return prisma.business.findUnique({
            where: {id: businessId},
            include: {
                owner: true,
                users: true,
                stores: true,
            }
        });
    }

    static async addUserToBusiness(businessId: number, userId: number){
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new ValidationError("User not found");

        if (user.businessId) {
        throw new ValidationError("User already belongs to a business");
        }

        return prisma.user.update({
            where: { id: userId },
            data: { businessId, userRole: "STAFF" }
            });
    }

    static async removeUserFromBusiness(businessId: number, userId: number) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
    
        if (!user || user.businessId !== businessId) {
          throw new ValidationError("User not in this business");
        }
    
        if (user.userRole === "OWNER") {
          throw new ValidationError("Cannot remove business owner");
        }
    
        return prisma.user.update({
          where: { id: userId },
          data: { businessId: null }
        });
    }

    static async getAllBusinesses(){
        return prisma.business.findMany({
            include: {
                owner: true,
                stores: true
            }
        });
    }


}