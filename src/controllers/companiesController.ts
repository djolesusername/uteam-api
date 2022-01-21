import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import { UserRole } from "../types/types";
import Company from "../models/companies";
import User from "../models/User";
import Profile from "../models/Profile";

dotenv.config();

const addCompany = async (req: Request, res: Response) => {
    try {
        await Company.create({
            name: String(Math.random()),
            logo: "https://mom.rs",
            slug: "Djole123",
        }).then((result) => {
            console.log("Created new User", result);
        });
    } catch (err) {
        console.log(err);
    }
    res.status(201).json("User created");
};

const getCompanies = async (req: Request, res: Response) => {
    const companies = await Company.findAll({ limit: 20 });
    if (companies) {
        res.status(200).json({ companies });
    } else {
        res.status(404).json({ message: "Company not found" });
    }
};

const getCompanybyId = async (req: Request, res: Response) => {
    const id = Number(req.params.uid) || 0;
    const company = await Company.findOne({
        where: { id },
    });
    if (company) {
        res.status(200).json({ company });
    } else {
        res.status(404).json({ message: "Company not found" });
    }
};

const deleteCompany = async (req: Request, res: Response) => {
    //We are checking if user has a profile. If so, profile is being deleted and then the user

    const id = Number(req.params.uid);

    try {
        const company = await Company.findOne({
            where: { id: id },
        });

        if (company) {
            await Company.destroy({
                where: {
                    id: id,
                },
            });

            res.status(200).json({ message: "Company deleted" });
        } else {
            res.status(400).json({ message: "Company doesn't exist" });
        }
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "error deleting company" });
    }
};

const updateCompany = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }

    res.status(200).json({ company: "Update route reached" });
};

export default {
    getCompanies,
    getCompanybyId,
    deleteCompany,
    updateCompany,
    addCompany,
};
