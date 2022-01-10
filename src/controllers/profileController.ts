import Profile from "../models/Profile"
import {Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"
import dotenv from 'dotenv'
dotenv.config()
import { Status } from "../types/types"

const postAddProfile = async (req: Request, res: Response) => {

    const name:string= req.body.name
    const profilePhoto:string=  req.body.profilePhoto
    const status:Status = Status.PENDING
    const userid = parseFloat(req.params.id)
   const errors =  validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({message: 'Validation error', errors: errors.array()})
    }
 
     try {
     await Profile.create({
         name: name,
         profilePhoto: profilePhoto,
         status: status,
         user: userid
       }).then(result => {
           // console.log(result);
           console.log('Created profile');
           console.log(result)
         })
     }
    catch(err) {
 console.log(err)
 }
 
res.status(201).json("Profile created");
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllProfiles = async(req: Request, res: Response, next: NextFunction) => {
  console.log('got here')
  try { const profiles = await Profile.findAll();
        res.status(200).json({profiles: profiles});

  } catch(err) {
    console.log(err)
  }
 
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProfilebyId = async(req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.uid)
  const profile = await Profile.findOne({
    where: {user: id}
  });
  res.status(200).json({profile: profile});
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteProfile = async(req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.uid)
  await Profile.destroy({
    where: {
      user: id
    }
  });
  res.status(200).json('user deleted');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateProfile = async(req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.uid)
//TODO Check if mf exsists :)

  const name = req.body.name;
  const profilePhoto = req.body.profilePhoto;
  await Profile.update({ name: name, profilePhoto:profilePhoto, status: Status.PENDING, user: id }, {
    where: {
      user: id
    }
  });
  
}



  
  




const userControls = {
    getAllProfiles,
    getProfilebyId,
    postAddProfile,
    updateProfile,
    deleteProfile
    
}
export default userControls