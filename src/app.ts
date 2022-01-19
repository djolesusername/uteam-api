import express, {
    NextFunction,
    Request,
    Response,
    ErrorRequestHandler,
} from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import profileRoutes from "./routes/profileRoutes";
import userRoutes from "./routes/routes";
import sequelize from "./config/database";

// load configuration from .env file
dotenv.config();

// create express app
const app = express();

// parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Define routes
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
