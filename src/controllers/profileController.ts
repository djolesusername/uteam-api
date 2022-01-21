import Profile from "../models/Profile";
import Company from "../models/companies";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();
import { Status } from "../types/types";

const postAddProfile = async (req: Request, res: Response) => {
    const name: string = req.body.name;
    const profilePhoto: string = req.body.profilePhoto;
    const status: Status = Status.PENDING;
    const userid = parseFloat(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    try {
        const profile = await Profile.findOne({
            where: { user: userid },
        });

        if (profile) {
            res.status(400).json({ message: "Profile already exsists" });
        }

        await Profile.create({
            name: name,
            profilePhoto: profilePhoto,
            status: status,
            user: userid,
            company: null,
        });

        res.status(200).json({ message: "Profile created" });
    } catch (err) {
        res.status(500).json({ message: "Error adding profile" });
    }
};

const getAllProfiles = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.findAll({ limit: 20 });

        if (!profiles) {
            res.status(404).json({ message: "No profiles found" });
        }

        res.status(200).json({ profiles: profiles });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "error loading profiles" });
    }
};

const getProfilebyId = async (req: Request, res: Response) => {
    const id = Number(req.params.uid);

    try {
        const profile = await Profile.findOne({
            where: { user: id },
        });

        if (profile) {
            res.status(200).json({ profile: profile });
        } else {
            res.status(404).json({ message: "Profile not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "error loading profile" });
    }
};

const deleteProfile = async (req: Request, res: Response) => {
    const id = Number(req.params.uid);
    try {
        const profile = await Profile.findOne({
            where: { user: id },
        });
        if (profile) {
            await Profile.destroy({
                where: {
                    user: id,
                },
            });
            res.status(200).json({ message: "profile deleted" });
        } else {
            res.status(404).json({ message: "profile not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "error deleting profile" });
    }
};

const updateProfile = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    const id = Number(req.params.id);
    //Express validator check user exists now confirming that profile exsists
    const profile = await Profile.findOne({
        where: { user: id },
    });

    const name = req.body.name;
    const profilePhoto = req.body.profilePhoto;
    const company = req.body.company || profile?.company;
    try {
        if (profile) {
            await Profile.update(
                {
                    name: name,
                    profilePhoto: profilePhoto,
                    status: Status.PENDING,
                    user: id,
                    company,
                },
                {
                    where: {
                        user: id,
                    },
                }
            );
            res.status(200).json({
                message: `user ${id} updated`,
                name,
                profilePhoto,
                company,
            });
        } else {
            res.status(404).json({ message: `Profile not found` });
        }
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const userControls = {
    getAllProfiles,
    getProfilebyId,
    postAddProfile,
    updateProfile,
    deleteProfile,
};
export default userControls;
