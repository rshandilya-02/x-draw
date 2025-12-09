import { JWT_SECRET } from "@repo/backend-common/client";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const auth = async (req:Request, res:Response, next:NextFunction) => {
    
    const data = req.headers['authorization'];
    console.log('req headers ', req.headers['authorization']);
    const token = data?.split(' ')[1];
    console.log('token is ', token);
    if (!token) return res.status(403).json({
        "message": "access not granted"
    });

    const decoded = await jwt.verify(token, JWT_SECRET);
    if (!decoded) return res.status(401).json({
        "message": "invalid token"
    });

    console.log('decoded', decoded);
    req.userId = (decoded as JwtPayload).id;
    console.log('req user Id ', req.userId);
    next();
}