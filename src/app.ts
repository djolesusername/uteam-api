import express, { Application  } from "express";
import routes from "./routes/routes"
import dotenv from 'dotenv'
dotenv.config()
 
const app: Application  = express()


app.use(routes)

app.listen(process.env.APP_PORT, () => console.log("123"))