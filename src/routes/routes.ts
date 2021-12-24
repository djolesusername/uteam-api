import { Router, Request, Response, NextFunction } from "express";
import {User} from "../models/User"

//const myData: object[] = []
type RequestBody = {email: string, username: string, password: string}

const router = Router()
const message = "Hello"
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({message: message})
})

//Fix this baby
router.post('/new-user', (req, res, next) => {
    const body = req.body as RequestBody
    const newUser: User = {
        id: new Date().toISOString(),
        username: body.username,
        email: body.email,
        password: body.password

    }
console.log(newUser)
  //  myData.push(newUser)
})


router.put('', (req, res, next) => {
    res.status(422).send('Route not ready :)')
})


router.delete('', (req, res, next) => {
    res.status(422).send('Route not ready :)')

})
export default router