import { Request, Response, response } from 'express';
import asyncHandler from 'express-async-handler'
import generateToken from '../config/jwtToken'
import User from '../models/userModel'
import { ObjectId } from 'mongoose';
import validateMongoDbId from '../utils/validateMongodbid';
import generateRefreshToken from '../config/refreshToken';
import jwt, { Secret } from 'jsonwebtoken';

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

  // @ts-expect-error
  if(findUser && (await findUser.isPasswordMatched(password))){
    // @ts-expect-error
    const refreshToken = await generateRefreshToken(findUser._id)
    const updateUser = await User.findByIdAndUpdate(findUser._id, {
      refreshToken: refreshToken
    },{
      new: true
    })
    res.cookie('refreshToken', refreshToken,{
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000
    })
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

// hanlde refresh token

const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
  const refreshToken = cookie.refreshTOken;
  const user = await User.findOne({refreshToken: refreshToken})
  if(!user) throw new Error('Not refreshToken present in db')
  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET as Secret, 
    (err: any , decoded: any) => {
      if(err || user.id !== decoded.id){
        throw new Error('There is something wrong with refresh token')
      }
      // @ts-expect-error
      const accessToken = generateToken(user._id)
      res.json({accessToken})
    }
  )

})

// logout 

const logout  = asyncHandler(async (req: Request, res: Response) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
  const refreshToken = cookie.refreshTOken;
  const user = await User.findOne({refreshToken: refreshToken})
  if(!user){
    res.clearCookie('refreshToken',{
      httpOnly: true,
      secure: true
    })
    res.sendStatus(204); // forbidden
  } else {
    await User.findByIdAndUpdate(refreshToken, {
      refreshToken: '',
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true
    })
    res.sendStatus(204)
  }
})

const updateUser =  asyncHandler(async (req: Request, res: Response) => {
  // @ts-expect-error
  const { _id } = req.user;
  validateMongoDbId(_id)
  try{
    const updateUser = await User.findByIdAndUpdate(_id, {
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
  validateMongoDbId(id)
  try{
    const getUser = await User.findById(id);
    res.json(getUser)
  } catch(error){
    throw new Error(error as string)
  }
})

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try{
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser)
  } catch(error){
    throw new Error(error as string)
  }
})

const blockUser = asyncHandler(async (req: Request, res: Response) => {
  const {id} = req.params;
  validateMongoDbId(id)
  try{
    const block = await User.findByIdAndUpdate(id,{
      isBlocked: true,
    },{
      new: true      
    })
    res.json({
      message: 'user blocked'
    })
  }catch(error){
    throw new Error(error as string)
  }
})

const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  const {id} = req.params;
  validateMongoDbId(id)
  try{
    const block = await User.findByIdAndUpdate(id,{
      isBlocked: false,
    },{
      new: true      
    })
    res.json({
      message: 'user unblocked'
    })
  }catch(error){
    throw new Error(error as string)
  }
})

export default { 
  createUser,
  loginUserCtrl, 
  getAllUser, 
  getUser, 
  deleteUser, 
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout
};