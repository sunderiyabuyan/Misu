import { Router } from "express";
import { UserController } from "../controller/userController.js";
import { requireAuth, validate, authorizedRoles } from "../middlewares/authHelpers.js";
import { createUserSchema, updateUserSchema, updatePasswordSchema } from "../validation/userValidation.js";
import { UserRole } from "@prisma/client";

const router = Router();

router.post('/create-user', validate(createUserSchema), requireAuth, authorizedRoles(UserRole.ADMIN), UserController.createUser);

router.get('/profile', requireAuth,UserController.getUserProfile);

router.put('/profile-update', requireAuth, validate(updateUserSchema), UserController.updateUser);

router.get('/users', requireAuth, authorizedRoles(UserRole.ADMIN), UserController.getAllUser);

router.get('/:id', requireAuth, authorizedRoles(UserRole.ADMIN),UserController.getUserById)

router.put('/update-password', requireAuth, validate(updatePasswordSchema), UserController.updatePassword);

router.delete('/:id', requireAuth, authorizedRoles(UserRole.ADMIN), UserController.deleteUser);



export default router;