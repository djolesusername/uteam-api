import express, {
    Application,
    NextFunction,
    Request,
    Response,
    ErrorRequestHandler,
} from "express";
import profileRoutes from "./routes/profileRoutes";
import userRoutes from "./routes/routes";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
import bodyParser from "body-parser";
const app: Application = express();

app.use(bodyParser.json());

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

sequelize
    .sync()
    .then(() => {
        app.listen(process.env.APP_PORT, () => console.log("Server up"));
    })
    .catch((err) => console.log(err));
