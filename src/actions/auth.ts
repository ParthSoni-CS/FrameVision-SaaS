"use server";

import { hash } from "bcryptjs";
import { sign, randomBytes } from "crypto";
import { signupSchema, SignupSchema } from "~/schemas/auth";

import { db } from "~/server/db";

export async function registerUser(data: SignupSchema) {
    try{
        // Server-side validation
        const result = signupSchema.safeParse(data);
        if(!result.success) {
            return {error: "Invalid data"};
        }

        // Create a user
        const {name, email, password} = result.data;

        // Check if the user already exists
        const exisitingUser = await db.user.findUnique({ 
            where: { email }
        });

        if(exisitingUser) {
            return {error: "User already exists"};
        }

        // Create a new user
        const hashedPassword = await hash(password, 12);

        await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                apiQuota: {
                    create: {
                        secretKey: `fv_live_${randomBytes(24).toString("hex")}`,
                    },
                    
                }
            }
        });
        return {success: true};
    }
    catch(error) {
       return {error: "Something went wrong. Please try again later."};
    }
}