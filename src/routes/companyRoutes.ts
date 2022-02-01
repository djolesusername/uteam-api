import { Router } from "express";
import companyControls from "../controllers/companiesController";
import { check } from "express-validator";
import passport from "passport";

const requireAuth = passport.authenticate("jwt", { session: false });

const router = Router();

router.get("/", companyControls.getCompanies);
router.get("/:uid", companyControls.getCompanybyId);

/*router.post(
    "/",
    check("name")
        .notEmpty()
        .withMessage("Name is needed")
        .matches(/^[a-zA-Z0-9 ]+$/i),
    check("logo").isURL(),

    companyControls.addCompany
);
*/

//Authorization logic needed
router.put(
    "/:id",
    requireAuth,
    check("name")
        .notEmpty()
        .withMessage("Name is needed")
        .matches(/^[a-zA-Z0-9 ]+$/i),

    check("logo").isURL(),

    companyControls.updateCompany
);

//Authorization logic needed
router.delete("/:uid", requireAuth, companyControls.deleteCompany);

export default router;
