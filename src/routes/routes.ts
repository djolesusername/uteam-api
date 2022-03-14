import { Router } from "express";
import userControls from "../controllers/userController";
import { check, oneOf } from "express-validator";
import User from "../models/User";
import passport from "passport";

const requireAuthorization = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

const router = Router();
router.get("/", userControls.getAllUsers);
router.get("/:uid", userControls.getUserbyId);

router.post(
    "/register",
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail()
        .custom(async (value) => {
            //Express validator will check for booleans, promises, errors. For promise it will wait for promise resolution
            //in case of rejection stores it as error
            return User.findOne({ where: { email: value } }).then((user) => {
                if (user) {
                    return Promise.reject("Email already in use");
                }
            });
        }),
    check("username")
        .notEmpty()
        .withMessage("Please enter a username")
        .matches(/^[a-z][a-zA-Z0-9_\-\#\%\*]+$/)
        .custom(async (value) => {
            const user = await User.findOne({ where: { username: value } });
            if (user) {
                return Promise.reject("Username already taken");
            }
        }),
    check(
        "password",
        "Valid password should have at least 8 characters"
    ).isLength({ min: 8 }),
    check("name").notEmpty().withMessage("Name is needed"),
    check("profilePhoto").optional().isURL(),
    check("companyName")
        .optional()

        .matches(/^[a-zA-Z0-9 ]+$/i),
    check("logo").optional().isURL(),
    userControls.postAddUser
);

router.post(
    "/login",
    oneOf([
        check("username").matches(/^[a-z][a-zA-Z0-9_\-\#\%\*]+$/),
        check("username")
            .notEmpty()
            .isEmail()
            .withMessage("Please enter a valid email")
            .custom((value) => {
                //Express validator will check for booleans, promises, errors. For promise it will wait for promise resolution
                //in case of rejection stores it as error
                return User.findOne({ where: { email: value } }).then(
                    (user) => {
                        if (!user) {
                            return Promise.reject("login error");
                        }
                    }
                );
            })
            .normalizeEmail(),
    ]),

    check("password").notEmpty().isLength({ min: 8 }).trim(),
    requireSignin,

    userControls.postLogin
);

//Authorization logic needed
router.put(
    "/:uid",
    check("uid").notEmpty().withMessage("Profile id needed"),
    check("username")
        .notEmpty()
        .withMessage("Please enter a username")
        .matches(/^[a-z][a-zA-Z0-9_\-\#\%\*]+$/),
    check("password").notEmpty().isLength({ min: 8 }).trim(),
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    requireAuthorization,

    userControls.updateUser
);

//Authorization logic needed
router.delete("/:uid", requireAuthorization, userControls.deleteUser);

export default router;
