import { Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import slugify from "../util/slug";
import Company from "../models/companies";
import User from "../models/User";

dotenv.config();

const addCompany = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    const passportData = req.user as User;
    const companyOwner = passportData.id;

    const name: string = req.body.name;
    const logo: string =
        req.body.profilePhoto ||
        "https://mom.rs/wp-content/uploads/2016/10/test-logo.png";
    const slug = slugify(name);
    try {
        const newCompany = await Company.create({
            name,
            logo,
            slug,
            companyOwner,
        });

        res.status(201).json({ company: newCompany });
    } catch (err) {
        res.status(500).json({ message: "error creating Company" });
    }
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
    const id = Number(req.params.uid);
    const passportData = req.user as User;

    try {
        const company = await Company.findOne({
            where: { id: id },
        });
        if (company && passportData.id !== company.companyOwner) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

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
        res.status(500).json({ message: "error deleting company" });
    }
};

const updateCompany = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(422)
            .json({ message: "Validation error", errors: errors.array() });
    }
    const id = Number(req.params.id);

    const company = await Company.findOne({
        where: { id: id },
    });

    const passportData = req.user as User;

    if (company && passportData.id !== company.companyOwner) {
        return res.status(403).json({
            message: "Not authorized",
        });
    }

    const name = req.body.name || company?.name;
    const logo = req.body.logo || company?.logo;
    const slug = slugify(name) || company?.slug;
    try {
        if (company) {
            await Company.update(
                {
                    name,
                    logo,
                    slug,
                },
                {
                    where: {
                        id: id,
                    },
                }
            );
            res.status(200).json({
                message: `company ${id} updated`,
                name,
                logo,
                company,
            });
        } else {
            res.status(404).json({ message: `Company not found` });
        }
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export default {
    getCompanies,
    getCompanybyId,
    deleteCompany,
    updateCompany,
    addCompany,
};
