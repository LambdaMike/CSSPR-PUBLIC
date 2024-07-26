import { Request, Response } from "express";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import prisma from "../config/db";
import { adminSchema, adminUpdateSchema } from "../middleware/validator";

export const create = async (req: Request, res: Response) => {
    try {
        const validatedData = adminSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json( { message: "Invalid data" } );
            return;
        }

        const adminData = {
            username: validatedData.data.username,
            password: bcrypt.hashSync(validatedData.data.password, 10),
            ...(validatedData.data.userId ? { userId: validatedData.data.userId } : {}),
        };

        const admin = await prisma.admin.create({
            data: adminData
        });
        res.status(200).json(admin);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({ message: "Error creating a new admin. Maybe it already exists" });
        }
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const validatedData = adminUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            res.status(400).json({ message: "Invalid data" });
            return;
        }

        const admin = await prisma.admin.update({
            where: { id: Number(req.params.id) },
            data: {
                username: validatedData.data.username,
            }
        });
        res.status(200).json(admin);
    } catch (e) {
        if (e instanceof ZodError) {
            res.status(400).json({ message: "Invalid data" });
        }
        else {
            res.status(500).json({message: "Error on update admin."});
        }
    }
}

export const remove = async (req: Request, res: Response) => {
    try {
        await prisma.admin.update({
            where: {id: Number(req.params.id)},
            data: { deletedAt: new Date() }
        });
    } catch (e) {
        res.status(500).json({message: "Error on removing admin."});
    }
};

export const restore = async (req: Request, res: Response) => {
    try {
        await prisma.admin.update({
            where: {id: Number(req.params.id)},
            data: { deletedAt: null }
        });
    } catch (e) {
        res.status(500).json({message: "Error on restoring admin."});
    }
}
export const findOne = async (req: Request, res: Response) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {id: Number(req.params.id)}
        });
        res.status(200).json(admin);
    } catch (e) {
        res.status(500).json({message: "Error on find admin."});
    }
}

interface adminQuery {
    name?: { contains: string };
}

export const findAll = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.query;

        let query: any = {}; // adminQuery
        if (name) {
            query['name'] = { contains: name as string };
        }

        const admins = await prisma.admin.findMany({
            where: query
        });

        res.status(200).json(admins);
    } catch (e) {
        res.status(500).json({ message: "Error on find admins." });
    }
};