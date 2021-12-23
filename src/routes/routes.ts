import { Router, Request, Response, NextFunction } from "express";
import {Model} from "../models/model"

const myData: Model[] = []
type RequestBody = {name: string}

const router = Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('Hello1')
})

//Fix this baby
router.post('/', (req, res, next) => {
    const body = req.body as RequestBody
    const newItem: Model = {
        id: new Date().toISOString(),
        name: body.name

    }

    myData.push(newItem)
})


router.put('', (req, res, next) => {
    res.status(422).send('Route not ready :)')
})


router.delete('', (req, res, next) => {
    res.status(422).send('Route not ready :)')

})
export default router