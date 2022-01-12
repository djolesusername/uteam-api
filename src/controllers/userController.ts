import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Profile from "../models/Profile";
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const postAddUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    const username = req.body.username;
    const email = req.body.email;
    const password =
        req.body.password && (await bcrypt.hash(req.body.password, 12));

    try {
        await User.create({
            username: username,
            password: password,
            email: email,
        }).then((result) => {
            // console.log(result);
            console.log("Created User");
            console.log(result);
        });
    } catch (err) {
        console.log(err);
    }
    res.status(201).json("User created");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.findAll();
    if (users) {
        res.status(200).json({ users: users });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUserbyId = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.uid) || 0;
    const user = await User.findOne({
        where: { id: id },
    });
    if (user) {
        res.status(200).json({ user: user });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    //We are checking if user has a profile. If so, profile is being deleted and then the user

    const id = Number(req.params.uid);

    try {
        const profile = await Profile.findOne({
            where: { user: id },
        });
        const user = await User.findOne({
            where: { id },
        });

        if (profile) {
            await Profile.destroy({
                where: {
                    user: id,
                },
            });
        }

        if (user) {
            await User.destroy({
                where: {
                    id: id,
                },
            });
            res.status(200).json({ message: "User deleted" });
        } else {
            res.status(400).json({ message: "User doesn't exist" });
        }
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "error deleting user" });
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    const id = Number(req.params.uid) || 0;
    const password =
        req.body.password && (await bcrypt.hash(req.body.password, 12));
    const email = req.body.email;
    const user = await User.findOne({
        where: { id: id },
    });
    //username in jwt token and not editable at the moment
    const username = user?.username;
    //allowing email change at the moment as long as email is not assigned to a different user
    let userEmail;
    if (email !== user?.email) {
        userEmail = await User.findOne({
            where: { email: email },
        });
        if (userEmail) {
            res.status(422).json({ message: "email already in use" });
            return next();
        }
    }

    try {
        //if email is unchanged or the same as stored moving on to save into db
        if (user && username) {
            await User.update(
                {
                    username: username,
                    password: password,
                    email: email,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            res.status(200).json({ message: "User updated" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Somethin went wrong" });
    }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }

    const username = req.body.username;
    const password = req.body.password;

    await User.findOne({
        where: { username: username },
    })
        .then((user) => {
            if (!user) {
                return res
                    .status(403)
                    .json({ message: "user not found", username: username });
            }
            if (!!user) {
                bcrypt.compare(password, user.password).then((result) => {
                    if (result && process.env.JWT_SECRET) {
                        const token = jwt.sign(
                            { username: username },
                            process.env.JWT_SECRET,
                            { expiresIn: "8h" }
                        );
                        return res
                            .status(200)
                            .json({ message: "OK", token: token });
                    } else {
                        return res.status(403).json({
                            message: "wrong password",
                            username: username,
                        });
                    }
                });
            }
        })
        .catch((err) => {
            console.log("general error");
            console.log(err);
        });
};

const userControls = {
    postAddUser,
    getAllUsers,
    getUserbyId,
    deleteUser,
    updateUser,
    postLogin,
};
export default userControls;
