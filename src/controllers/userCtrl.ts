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

const getAllUser= asyncHandler( async (req: Request, res: Response) => {
  try{
    const getUsers = await User.find();
    res.json(getUsers)
  } catch(error){
    throw new Error(error as string)
  }
})

const updateUser =  asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const updateUser = await User.findByIdAndUpdate(id, {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobile: req.body.mobile,
    },{
      new: true,
    });
    res.json(updateUser)
  } catch(error){
    throw new Error(error as string)
  }
})

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const getUser = await User.findById(id);
    res.json(getUser)
  } catch(error){
    throw new Error(error as string)
  }
})

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser)
  } catch(error){
    throw new Error(error as string)
  }
})

export default { createUser, loginUserCtrl, getAllUser, getUser, deleteUser, updateUser};