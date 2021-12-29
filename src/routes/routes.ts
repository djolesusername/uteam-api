import { Router } from "express";
import userRoutes from "../controllers/userController"
import { check } from 'express-validator'; 
import User from "../models/User";

//const myData: object[] = []

const router = Router()

router.get('/',
    userRoutes.getAllUsers
)
router.get('/:uid',   userRoutes.getUserbyId)

router.post('/signup', 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            check('email').isEmail().withMessage('Please enter a valid email').custom((value, {req}) => {
                //Express validator will check for booleans, promises, errors. For promise it will wait for promise resolution
                //in case of rejection stores it as error
                return User.findOne({where: {email: value}}).then (user => {
                    if (user) {
                        return Promise.reject('Email already in use')
                    }
                }) 
            }).normalizeEmail(), 
            check('password', 'Valid password should have at least 8 characters').isLength({min: 8}), 
            userRoutes.postAddUser)
router.post('/login',  check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),  check('password').isLength({min: 8}).trim(), userRoutes.postLogin)

//Authorization logic needed
router.put('/:uid', userRoutes.updateUser)

//Authorization logic needed
router.delete('/:uid',userRoutes.deleteUser)
export default router