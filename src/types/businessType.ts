import { OperationStatus } from "@prisma/client";

export interface CreateBusinessDTO{
    name: string;
    ownerId: number;
    createdAt: Date | string;
    updatedAt: Date | string;

}

export interface UpdateBusinessDTO{
    name?: string;
}

export interface UpdateStatus{
    businessId: number;
    status: OperationStatus;
}
export interface AssignOwnerDTO{
    ownerId: number;
}
