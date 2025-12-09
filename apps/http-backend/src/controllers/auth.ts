import { prisma } from "@repo/db";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/client";

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    
    if (!email || !password) return res.status(400).json({
        message: "fields missing"
    });

    try {
        const users = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (users) return res.status(403).json({
            "message": "user already exists"
        });
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword
            }
        });
        return res.status(200).json({
            message: "registration successful"
        })
    } catch (error) {
        console.error(error);
        return res.status(503).json('registration failed');
    }


};

export const login = async (req:Request, res:Response) => {
    const { email, password } = req.body; 
    if (!email || !password) return res.status(402).json({
        message: "missing fields"
    });

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(503).json({
                message:"no such user exists"
            })
        };
        const userPassword = user.password;
        const check = await bcrypt.compare(password, userPassword);
        if (!check) return res.status(403).json({
            "message": "invalid credentials"
        });
        const payload = {id:user.id,username:user.email,photo:user?.photo}
        const token = await jwt.sign(payload, JWT_SECRET);
        return res.status(200).json({
            message: "login successful",
            token:token
        })
    } catch (error) {
        return res.status(503).json({
            message: "error during login",
            data:error
        })
    }

}