import User from "../models/User"
import {Request, Response, NextFunction} from "express"
import bcrypt from 'bcryptjs'
import { validationResult } from "express-validator"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const postAddUser = async (req: Request, res: Response, next: NextFunction) => {
    const username = req.body.username;
    const email = req.body.email;
   const password = await bcrypt.hash(req.body.password, 12)
   const errors =  validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(422).json({message: 'Validation error', errors: errors.array()})
   }

    try {
    await User.create({
        username: username,
        password: password,
        email: email,
      }).then(result => {
          // console.log(result);
          console.log('Created User');
          console.log(result)
        })
    }
   catch(err) {
console.log(err)
}
res.status(201).json("User created");
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = async(req: Request, res: Response, next: NextFunction) => {
  const users = await User.findAll();
  res.status(200).json({users: users});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUserbyId = async(req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.uid)
  const user = await User.findOne({
    where: {id: id}
  });
  res.status(200).json({user: user});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteUser = async(req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.uid)
  await User.destroy({
    where: {
      id: id
    }
  });
  res.status(200).json('user deleted');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = async(req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.uid)

  const password = req.body.password;
  const email = req.body.email;
  await User.update({ password: password, email: email }, {
    where: {
      id: id
    }
  });
  
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const postLogin = async(req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  const password = req.body.password;
   await User.findOne({
    where: {email: email}
  })
  .then (user => {
    if (!user) {
     return res.status(403).json({"message": "user not found", "email": email})
          }
          if (!!user) {
          bcrypt.compare(password, user.password )
            .then(result => {
                      if (result && process.env.JWT_SECRET ) {
                        
                 const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '8h'} )       
               return res.status(200).json({"message": "OK", token: token})
              } 
              else {
               return res.status(403).json({"message": "wrong password", "email": email})
              }
                    
            })
          }
    
    }).catch(err => {
      console.log('general error')
      console.log(err)
    })

  
  } 
  





const userRoutes = {
  postAddUser,
  getAllUsers,
  getUserbyId,
  deleteUser,
  updateUser,
  postLogin
}
export default userRoutes