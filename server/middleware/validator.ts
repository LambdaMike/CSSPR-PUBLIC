import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
    email: z.string().email({ message: "Invalid email." }),
    role: z.string().min(3, { message: "Role must be at least 3 characters long." }),
    department: z.string().min(3, { message: "Department must be at least 3 characters long." }),
});

export const userUpdateSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long." }).optional(),
    email: z.string().email({ message: "Invalid email." }).optional(),
    role: z.string().min(3, { message: "Role must be at least 3 characters long." }).optional(),
    department: z.string().min(3, { message: "Department must be at least 3 characters long." }).optional(),
});

export const adminSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
    password: z.string().min(3, { message: "Password must be at least 3 characters long" }), // Password implement .min(6) in production
    userId: z.string().optional(),
});

export const adminUpdateSchema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters long." }).optional(),
    password: z.string().min(3, { message: "Password must be at least 3 characters long" }).optional(), // Password implement .min(6) in production
    userId: z.string().optional(),
});

export const RoleOrDepartmentSchema = z.object({
    name: z.string().min(1),
});

export const RoleOrDepartmentUpdateSchema = z.object({
    name: z.string().min(1, { message: "Name must be at least 1 characters long." }).optional(),
});
