import User from "../models/User"
import {Request, Response, NextFunction} from "express"
import bcrypt from 'bcryptjs'
import { validationResult } from "express-validator"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Profile from "../models/Profile"
dotenv.config()


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const postAddUser = async (req: Request, res: Response, next: NextFunction) => {

  
   const errors =  validationResult(req);
   if (!errors.isEmpty()) {
     console.log(errors)
     return res.status(422).json({message: 'Validation error', errors: errors.array()})
   }
   const username = req.body.username;
    const email = req.body.email;
   const password = req.body.password && await bcrypt.hash(req.body.password, 12)

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

try {
  await Profile.findOne({
    where: {user: id}
  }).then( user => {
    if (user) {

Profile.destroy({
  where: {
    user: id
  }
})    }
  }).then( () => {
    User.destroy({
      where: {
        id: id
      }
    })  })
} catch (err) {
  console.log(err)
}


   
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
  const errors =  validationResult(req);
   if (!errors.isEmpty()) {
     console.log(errors)
     return res.status(422).json({message: 'Validation error', errors: errors.array()})
   }


  const username = req.body.username;
  const password = req.body.password;

   await User.findOne({
    where: {username: username}
  })
  .then (user => {
    if (!user) {
     return res.status(403).json({"message": "user not found", "username": username})
          }
          if (!!user) {
          bcrypt.compare(password, user.password )
            .then(result => {
                      if (result && process.env.JWT_SECRET ) {
                        
                 const token = jwt.sign({email: user.email, username: username}, process.env.JWT_SECRET, {expiresIn: '8h'} )       
               return res.status(200).json({"message": "OK", token: token})
              } 
              else {
               return res.status(403).json({"message": "wrong password", "username": username})
              }
                    
            })
          }
    
    }).catch(err => {
      console.log('general error')
      console.log(err)
    })

  
  } 
  





const userControls = {
  postAddUser,
  getAllUsers,
  getUserbyId,
  deleteUser,
  updateUser,
  postLogin
}
export default userControls