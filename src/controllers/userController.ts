import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRole, Status } from "../types/types";
import User from "../models/User";
import Company from "../models/companies";
import Profile from "../models/Profile";
import slugify from "../util/slug";
import { Op } from "sequelize";
import sequelize from "../config/database";

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
    const name: string = req.body.name;
    const profilePhoto: string =
        req.body.profilePhoto ||
        "https://mom.rs/wp-content/uploads/2016/10/test-logo.png";
    const companyName: string = req.body.companyName || `${username}'s company`;
    const logo: string =
        req.body.logo ||
        "https://mom.rs/wp-content/uploads/2016/10/test-logo.png";
    const slug = slugify(companyName);

    if (name === username) {
        return res.status(422).json({
            message: "Validation error",
            errors: ["name cannot be same as username"],
        });
    }

    try {
        await sequelize.transaction(async (t) => {
            await User.create(
                {
                    username,
                    password,
                    email,
                    role,
                },
                { transaction: t }
            ).then(async (result) => {
                console.log("Created new User");
                console.log(result.id);

                await Profile.create(
                    {
                        name: name,
                        profilePhoto: profilePhoto,
                        status: Status.PENDING,
                        user: result.id,
                        company: null,
                    },
                    { transaction: t }
                );

                await Company.create(
                    {
                        name: companyName,
                        logo: logo,
                        slug: slug,
                        companyOwner: result.id,
                    },
                    { transaction: t }
                );
            });
        });
    } catch (err) {
        console.log(err);

        return res.status(501);
    }

    res.status(201).json("User created");
};

const getAllUsers = async (req: Request, res: Response) => {
    console.log(req.headers.authorization?.split(" ")[1]);
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
    const passportData = req.user as User;
    if (passportData.id !== id) {
        return res.status(403).json({ message: "Not authorized" });
    }

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
    //in order to be able to edit user it needs to be its own profile

    const passportData = req.user as User;
    if (passportData.id !== id) {
        return res.status(403).json({ message: "Not authorized" });
    }

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
    const username = req.body.username;
    let user;

    try {
        if (username) {
            user = await User.findOne({
                where: {
                    [Op.or]: [{ username: username }, { email: username }],
                },
            });
        } /*else if (email) {
            user = await User.findOne({
                where: { email: email },
            });
        }*/

        if (!user) {
            return res
                .status(403)
                .json({ message: "user not found", user: username });
        }

        // if process.env.JWT_SECRET is not defined throw an 500 error
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        // create a token
        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            {
                expiresIn: "16h",
            }
        );

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
