import User from "../models/userModel"
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import asyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express";

const authMiddleware = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
                // @ts-expect-error
                const user = await User.findById(decoded.id);
                // @ts-expect-error
                req.user = user;
                next()
            }
        }
        catch(error){
            throw new Error("not authorized token expired, Please Login again")
        }
    } else {
        throw new Error("there is no toker attacjed to header")
    }
})

const isAdmin = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    // @ts-expect-error
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if(adminUser && (adminUser.role !== "admin")){
        throw new Error("You are not an admin")
    } else {
        next()
    }
})

export default { authMiddleware, isAdmin }