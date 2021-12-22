import express, { Application, Request, Response,NextFunction } from "express";
require("dotenv").config();

 

const app: Application  = express()


app.get('/', (req: Request, res: Response, next: NextFunction) => {
    
    res.send('Hello')
})



app.listen(process.env.APP_PORT, () => console.log("123"))