import jwt, { Secret } from 'jsonwebtoken'
import { ObjectId } from 'mongoose';

const generateToken = (id: ObjectId) => {
    return jwt.sign({id}, process.env.JWT_SECRET as Secret, {expiresIn: "1d"});
}

export default generateToken