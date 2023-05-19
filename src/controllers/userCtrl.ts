import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler'
import generateToken from '../config/jwtToken'
import User from '../models/userModel'
import { ObjectId } from 'mongoose';

const createUser = asyncHandler( async (req: Request, res: Response) => {
  const email = req.body.email;
  const findUser = await User.findOne({email: email})
  if(!findUser){
    
    const newUser = await User.create(req.body);
    res.json(newUser)
  }
  else {
    throw new Error('User Already Exists')
  }
});

const loginUserCtrl = asyncHandler( async (req: Request, res: Response) => {
  const { email, password }  = req.body;
  const findUser = await User.findOne({email: email})
  console.log(typeof password)

  // @ts-expect-error
  if(findUser && (await findUser.isPasswordMatched(password))){
    res.json({
      _id: findUser._id,
      firstname: findUser.firstname,
      lastname: findUser.lastname,
      email: findUser.email,
      mobile: findUser.mobile,
      token: generateToken(findUser._id as unknown as ObjectId )
    })
  }
  else {
    throw new Error('Invalid Credentials')

  }
})

export default { createUser, loginUserCtrl };