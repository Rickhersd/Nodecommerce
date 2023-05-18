import User from '../models/userModel'

// @ts-expect-error
const createUser = async (req, res) => {
  const email = req.body.email;
  console.log('res')
  const findUser = await User.findOne({email: email})
  if(!findUser){
    
    const newUser = await User.create(req.body);
    res.json(newUser)
  }
  else {
    res.json({
      msg: 'User Already Exists',
      success: false,
    })    
  }
};

export default createUser;