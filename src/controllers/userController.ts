import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRole } from "../types/types";
import passport from "passport";
import User from "../models/User";
import Profile from "../models/Profile";

dotenv.config();

const postAddUser = async (req: Request, res: Response) => {
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
    const role = UserRole.COMPANYADMIN;
    try {
        await User.create({
            username,
            password,
            email,
            role,
        }).then((result) => {
            console.log("Created new User");
            console.log(result.id);
        });
    } catch (err) {
        console.log(err);
    }

    res.status(201).json("User created");
};

const getAllUsers = async (req: Request, res: Response) => {
    const users = await User.findAll({ limit: 20 });
    if (users) {
        res.status(200).json({ users });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

const getUserbyId = async (req: Request, res: Response) => {
    const id = Number(req.params.uid) || 0;
    const user = await User.findOne({
        where: { id },
    });
    if (user) {
        res.status(200).json({ user });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

const deleteUser = async (req: Request, res: Response) => {
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
        where: { id },
    });

    //username in jwt token and not editable at the moment
    const username = user?.username;
    const role = user?.role;
    //allowing email change at the moment as long as email is not assigned to a different user
    let userEmail;

    if (email !== user?.email) {
        userEmail = await User.findOne({
            where: { email },
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
                    username,
                    password,
                    email,
                    role,
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

const postLogin = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    const { username, password, email } = req.body;
    let user;

    try {
        if (username) {
            user = await User.findOne({
                where: { username: username },
            });
        } else if (email) {
            user = await User.findOne({
                where: { email: email },
            });
        }

        if (!user) {
            return res
                .status(403)
                .json({ message: "user not found", user: username || email });
        }

        // check if password matches
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(403).json({
                message: "Wrong password",
                username: username || email,
            });
        }

        // if process.env.JWT_SECRET is not defined throw an 500 error
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        // create a token
        const token = jwt.sign({ username: username }, process.env.JWT_SECRET, {
            expiresIn: "8h",
        });

        return res.status(200).json({ message: "OK", token: token });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export default {
    postAddUser,
    getAllUsers,
    getUserbyId,
    deleteUser,
    updateUser,
    postLogin,
};
