import jwt, { Secret } from 'jsonwebtoken'
import { ObjectId } from 'mongoose';

const generateRefreshToken = (id: ObjectId) => {
    return jwt.sign({id}, process.env.JWT_SECRET as Secret, {expiresIn: "3d"});
}

export default generateRefreshToken