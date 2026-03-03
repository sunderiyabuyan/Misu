import z from "zod";
import { OperationStatus } from "@prisma/client";

export const createBusinessSchema = z.object({
    name: z.string().min(1, "Name is required"),
    ownerId: z.number().int().positive()
});

export const updateBusinessSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
});

export const updateStatusSchema = z.object({
    businessId: z.number().int().positive(),
    status: z.enum(OperationStatus)
})

export const assignOwnerSchema = z.object({
    ownerId: z.number().int().positive()
});
