import { Router } from "express";
import userControls from "../controllers/userController";
import { check } from "express-validator";
import User from "../models/User";

//const myData: object[] = []

const router = Router();

router.get("/", userControls.getAllUsers);
router.get("/:uid", userControls.getUserbyId);

router.post(
    "/register",
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Please enter a valid email")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .custom((value, { req }) => {
            //Express validator will check for booleans, promises, errors. For promise it will wait for promise resolution
            //in case of rejection stores it as error
            return User.findOne({ where: { email: value } }).then((user) => {
                if (user) {
                    return Promise.reject("Email already in use");
                }
            });
        })
        .normalizeEmail(),
    check("username")
        .notEmpty()
        .withMessage("Please enter a username")
        .matches(/^[a-z]/)
        .matches(/^[a-zA-Z0-9_\-\#\%\*]+$/)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .custom(async (value, { req }) => {
            const user = await User.findOne({ where: { username: value } });
            if (user) {
                return Promise.reject("Username already taken");
            }
        }),
    check(
        "password",
        "Valid password should have at least 8 characters"
    ).isLength({ min: 8 }),
    userControls.postAddUser
);
router.post(
    "/login",
    check("username")
        .notEmpty()
        .withMessage("Please enter a username")
        .matches(/^[a-z]/)
        .matches(/^[a-zA-Z0-9_\-\#\%\*]+$/),
    check("password").notEmpty().isLength({ min: 8 }).trim(),
    userControls.postLogin
);

//Authorization logic needed
router.put(
    "/:uid",
    check("uid").notEmpty().withMessage("Profile id needed"),
    check("username")
        .notEmpty()
        .withMessage("Please enter a username")
        .matches(/^[a-z]/)
        .matches(/^[a-zA-Z0-9_\-\#\%\*]+$/),
    check("password").notEmpty().isLength({ min: 8 }).trim(),
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    userControls.updateUser
);

//Authorization logic needed
router.delete("/:uid", userControls.deleteUser);
export default router;
