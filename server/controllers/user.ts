import { Request, Response } from "express";
import { ZodError } from "zod";

import { userSchema, userUpdateSchema } from "../middleware/validator";
import prisma from "../config/db";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = userSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data", errors: validatedData.error.format() });
            return;
        }

        const user = await prisma.user.create({
            data: {
                name: validatedData.data.name,
                email: validatedData.data.email,
                roleId: validatedData.data.roleId,
                departmentId: validatedData.data.departmentId,
            }
        });
        res.status(200).json(user);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error on creating a new user." });
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const validatedData = userUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data", errors: validatedData.error.format() });
            return;
        }

        const userData = {
            ...(validatedData.data.name ? { name: validatedData.data.name } : {}),
            ...(validatedData.data.email ? { email: validatedData.data.email } : {}),
            ...(validatedData.data.roleId ? { roleId: validatedData.data.roleId } : {}),
            ...(validatedData.data.departmentId ? { departmentId: validatedData.data.departmentId } : {}),
        };

        const user = await prisma.user.update({
            where: { id: String(req.params.id) },
            data: userData
        });
        res.status(200).json(user);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({message: "Invalid data", errors: e.format()});
        }
        else {
            res.status(500).json({ message: "Error on update user." });
        }
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.user.update({
            where: { id: String(req.params.id) },
            data: { deletedAt: new Date() }
        });
        res.status(200).json({ message: "User removed successfully." }); // Corrected the unclosed string literal
    } catch (e) {
        res.status(500).json({ message: "Error on removing user." });
    }
};

export const restore = async (req: Request, res: Response) => {
    try {
        await prisma.user.update({
            where: { id: String(req.params.id) },
            data: { deletedAt: null }
        });
        res.status(200).json({ message: "User restored successfully." });
    } catch (e) {
        res.status(500).json({ message: "Error on restoring user. Check if another account is already registered." });
    }

}

export const findOne = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: String(req.params.id) }
        });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: "Error on find user." });
    }
}

interface UserQuery {
    name?: { contains: string };
    email?: { contains: string };
}

export const findAll = async (req: Request, res: Response) => {
    try {
        let { name, email, count } = req.query;

        let query: UserQuery = {};
        if (name) {
            query['name'] = { contains: name as string };
        }
        if (email) {
            query['email'] = { contains: email as string };
        }
        
        let parsedCount = 25;

        if (count) {
            try {
                parsedCount = parseInt(count as string);
            } catch (e) {
                parsedCount = 25;    
            }
        } 

        const users = await prisma.user.findMany({
            where: query,
            take: parsedCount
        });

        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: "Error on find users." });
    }
};