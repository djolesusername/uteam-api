import { Router } from "express";
import companyControls from "../controllers/companiesController";
import { check } from "express-validator";
import User from "../models/User";

const router = Router();

router.get("/", companyControls.getCompanies);
router.get("/:uid", companyControls.getCompanybyId);

router.post(
    "/",
    /*  check("name").notEmpty().withMessage("Name is needed"),
    check("profilePhoto").isURL(),
    check("id").custom(async (value) => {
        const user = await User.findOne({ where: { id: value } });
        if (!user) {
            return Promise.reject("User not found - profile cannot be created");
        }
    }),
    */
    companyControls.addCompany
);

//Authorization logic needed
router.put(
    "/:id",
    /* check("name").notEmpty().withMessage("Name is needed"),
    check("profilePhoto").isURL(),
    check("id").custom(async (value) => {
        const user = await User.findOne({ where: { id: value } });
        if (!user) {
            return Promise.reject(
                "User not found - profile cannot be accessed"
            );
        }
    }),
    */
    companyControls.updateCompany
);

//Authorization logic needed
router.delete("/:uid", companyControls.deleteCompany);

export default router;
