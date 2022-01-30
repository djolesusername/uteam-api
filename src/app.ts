import express, {
    NextFunction,
    Request,
    Response,
    ErrorRequestHandler,
} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import profileRoutes from "./routes/profileRoutes";
import companyRoutes from "./routes/companyRoutes";
import userRoutes from "./routes/routes";
import sequelize from "./config/database";
import cors from "cors";
import passport from "passport";
import passportConfig from "./config/passport";

// load configuration from .env file
dotenv.config();

// create express app
const app = express();

// parse JSON bodies (as sent by API clients)
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
passportConfig(passport);

// Define routes
app.use("/companies", companyRoutes);
app.use("/profiles", profileRoutes);
app.use("/", userRoutes);

app.use(function (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) {
    // error handling logic
    console.log(err);
    res.status(500).send("Something broke!");
});

// first initialize the database and then start the server
sequelize
    .sync()
    .then(() => {
        app.listen(process.env.APP_PORT, () => console.log("Server up"));
    })
    .catch((err) => console.log(err));
